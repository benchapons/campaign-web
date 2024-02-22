import { transformUserInfo, transformUserPage, transformUserResponse } from '@/dto/auth.dto';
import { AuthenticationService } from '@/services/server/authentication.service';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions | any = {
  session: {
    jwt: true,
    maxAge: 1 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 1 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.COOKIE_SESSION_NAME,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: process.env.COOKIE_CALLBACK_NAME,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: process.env.COOKIE_CSRF_NAME,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { code } = credentials as {
          code: string;
        };
        const authService = new AuthenticationService();
        const azureProfile = await authService.getProfileDataByCode(code);
        if (azureProfile.id) {
          return Promise.all([authService.getUserPage(azureProfile.id), authService.getUserInfo(azureProfile.id)])
            .then(([_userPage, _userInfo]) => {
              const userPageTransform = transformUserPage(_userPage);
              const userInfoTransform = transformUserInfo(_userInfo);
              const userTransformed = transformUserResponse(azureProfile, userPageTransform, userInfoTransform);
              return userTransformed;
            })
            .catch((error) => {
              console.error('nextAuthAuthorizeErr: ', error);
              throw new Error('Authorization error');
            });
        }
        return azureProfile;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.data;
      return session;
    },
  },
  requestTimeout: 10000,
  debug: true,
  logger: {
    error(code: any, metadata: any) {
      console.error('nextAuthError: ', code, metadata);
    },
    warn(code: any) {
      console.warn('nextAuthWarn: ', code);
    },
    debug(code: any, metadata: any) {
      console.log('nextAuthDebug: ', code, metadata);
    },
  },
};
export default NextAuth(authOptions);
