import { AuthenStatus, AuthorizedUserType } from '@/types/auth.type';
import { useSession } from 'next-auth/react';
import { NextRouter, useRouter } from 'next/router';
import { useMemo } from 'react';

export type UseUserHookType = {
  authorizedUser: AuthorizedUserType;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  router: NextRouter;
  currentDate: number;
};

const useUsers = (): UseUserHookType => {
  const { data, status } = useSession();
  const router = useRouter();
  const currentDate = Math.floor(Date.now() / 1000);

  const userPermission = useMemo<any>(() => {
    if (status === AuthenStatus.loading) return;
    if (status === AuthenStatus.authenticated) return data?.user;
  }, [data, status]);

  return { authorizedUser: userPermission, status, router, currentDate };
};

export default useUsers;
