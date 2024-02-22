import http from '@/configurations/spw-portal.api';
import { AzureProfile, UserInfoType, UserPageType } from '@/types/auth.type';
import axios from 'axios';
import * as querystring from 'querystring';
import { LoggerService } from './logger.service';

export class AuthenticationService {
  private azureTenantId: string;
  private azureClientId: string;
  private azureClientSecret: string;
  private azureLoginUrl: string;
  private azureProfileUrl: string;
  private redirectUri: string;
  constructor() {
    this.azureTenantId = process.env.AZURE_AD_TENANT_ID || '';
    this.azureClientId = process.env.AZURE_AD_CLIENT_ID || '';
    this.azureClientSecret = process.env.AZURE_AD_SECRET || '';
    this.redirectUri = process.env.AZURE_AD_REDIRECT_URI || '';
    this.azureLoginUrl = process.env.AZURE_AD_LOGIN_DOMAIN || '';
    this.azureProfileUrl = process.env.AZURE_AD_PROFILE || '';
  }

  async getProfileDataByCode(code: string): Promise<AzureProfile> {
    const tokenFromAzure = await this.getAccessTokenByCode(code, this.redirectUri);
    const azureProfile = await this.getUserProfileByAccessToken(tokenFromAzure?.access_token);
    return azureProfile;
  }

  async getAccessTokenByCode(code: string, redirect_uri: string): Promise<any> {
    const url = `${this.azureLoginUrl}/${this.azureTenantId}/oauth2/token`;
    const logger = new LoggerService();
    const data = {
      client_id: this.azureClientId,
      client_secret: this.azureClientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri,
    };
    const encodedData = querystring.stringify(data);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    logger.info('getAccessTokenByCode', url, data);
    return new Promise(async (resolve, reject) => {
      axios
        .post(`${url}`, encodedData, { headers: headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getUserProfileByAccessToken(accessToken: string): Promise<any> {
    const url = this.azureProfileUrl;
    const headers: any = {};
    headers['authorization'] = accessToken;
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${url}`, { headers: { ...headers } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getUserPage(userId: string): Promise<UserPageType[]> {
    const spwPortalAppId: string = process.env.SPW_PORTAL_APP_ID || '';
    return new Promise(async (resolve, reject) => {
      http
        .get(`/page/user/${userId}?appId=${spwPortalAppId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getUserInfo(userId: string): Promise<UserInfoType> {
    return new Promise(async (resolve, reject) => {
      http
        .get(`/users/${userId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
