export enum AuthenStatus {
  loading = 'loading',
  authenticated = 'authenticated',
  unauthenticated = 'unauthenticated',
}

export type UserResponseType = {
  azureProfile: AzureProfile;
  accessToken: string;
};

export type UserPageType = {
  id: string;
  displayName: string;
  appId: string;
};
export interface UserPageTransformType {
  [key: string]: boolean;
}

export interface UserInfoTransformType {
  userId?: string;
  isVLC?: boolean;
  brands?: any[];
  groups?: UserInfoGroupType[];
  shops?: any[];
  inCartRoles?: any[];
  miniAEMRoles?: any[];
  roleName?: string;
}
export interface UserInfoType {
  userId?: string;
  isVLC?: boolean;
  brands?: any[];
  groups?: UserInfoGroupType[];
  shops?: any[];
  inCartRoles?: any[];
  miniAEMRoles?: any[];
  roleName: string;
}
export interface UserInfoGroupType {
  id: string;
  displayName: string;
}

export type AzureProfile = {
  id: string;
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
};

export type AuthorizedUserType = {
  id: string;
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  expirationDate: number;
  userPage: UserPageTransformType;
  userInfo: UserInfoTransformType;
};

export type AzurePropTypes = {
  azureClientId: string;
  azureTenantId: string;
  azureScope: string;
  azureRedirectUrI: string;
  azureLogoutUrI: string;
  azureLoginDamain: string;
};

export type PagePermissionType = {
  [key: string]: TitlePermission;
};

export type TitlePermission = {
  title: string;
  permission: string[];
};
