import { AuthorizedUserType } from './auth.type';

export type CustomSession = {
  user: AuthorizedUserType;
  expires: string;
};

export type PageSessionType = {
  authorizedUser: AuthorizedUserType;
};
