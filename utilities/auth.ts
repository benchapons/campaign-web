import { AuthorizedUserType } from '@/types/auth.type';

export const isPagePermission = (authorizedUser: AuthorizedUserType, permission: string[]): boolean => {
  if (permission?.length === 0) return true;
  return permission?.some((item) => authorizedUser?.userPage[item]);
};
