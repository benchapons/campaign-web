import {
  AuthorizedUserType,
  AzureProfile,
  UserInfoTransformType,
  UserInfoType,
  UserPageTransformType,
  UserPageType,
} from '@/types/auth.type';
import _ from 'lodash';

export const transformUserResponse = (
  user: AzureProfile,
  userPage?: UserPageTransformType,
  userInfo?: UserInfoTransformType
): AuthorizedUserType => {
  const now = new Date();
  const timestampPlus24Hr = Math.floor(now.setHours(now.getHours() + 23) / 1000);
  return {
    ...user,
    expirationDate: timestampPlus24Hr,
    userPage: userPage ? userPage : {},
    userInfo: userInfo ? userInfo : {},
  };
};

export const transformUserPage = (userPages: UserPageType[]): UserPageTransformType => {
  const dataTransform: UserPageTransformType = {};
  userPages.forEach((userPage) => {
    dataTransform[userPage.displayName] = true;
  });
  return dataTransform;
};

export const transformUserInfo = (userInfo?: UserInfoType): UserInfoTransformType => {
  return {
    ...userInfo,
    roleName: userInfo?.groups
      ? userInfo?.groups
          .filter((group) => {
            const parts = group.displayName.split('Campaign/');
            return parts.length > 1 && parts[1].trim() !== '';
          })
          .map((group) => group.displayName.split('/')[1])
          .join('/')
      : '',
  };
};
