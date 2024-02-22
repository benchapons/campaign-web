export class AzureAdService {
  private authorizationDomain: string;
  private authorizationEndpoint: string;
  private clientId: string | undefined;
  private tenantId: string | undefined;
  private scope: string | undefined;
  private redirectUrl: string | undefined;
  private logoutUrl: string | undefined;
  private currentUrl: string | undefined;
  constructor(
    clientId: string,
    tenantId: string,
    scope: string,
    redirectUrl: string,
    logoutUrl: string,
    loginDomain: string
  ) {
    this.authorizationDomain = loginDomain;
    this.authorizationEndpoint = '/oauth2/v2.0/authorize';
    this.clientId = clientId;
    this.tenantId = tenantId;
    this.scope = scope;
    this.redirectUrl = redirectUrl;
    this.logoutUrl = logoutUrl;
    this.currentUrl =
      typeof window !== 'undefined'
        ? window.location.pathname !== '/auth/logout' && window.location.pathname !== '/auth/login'
          ? window.location.pathname
          : '/'
        : '/';
  }

  logIn(customRedirectUrl?: string) {
    const customParam = {
      customRedirectUrl:
        customRedirectUrl && customRedirectUrl !== '/auth/logout' && customRedirectUrl !== '/auth/login'
          ? customRedirectUrl
          : this.currentUrl,
    };
    const stateParam = Buffer.from(JSON.stringify(customParam)).toString('base64');
    const params = new URLSearchParams();
    params.append('client_id', this.clientId as string);
    params.append('scope', this.scope as string);
    params.append('response_type', 'code');
    params.append('redirect_uri', this.redirectUrl as string);
    params.append('state', stateParam);
    console.log('signIn --> ', params);
    window.location.replace(
      `${this.authorizationDomain}/${this.tenantId}${this.authorizationEndpoint}?${params.toString()}`
    );
  }

  getLogInUrl(customRedirectUrl?: string) {
    const customParam = {
      customRedirectUrl:
        customRedirectUrl && customRedirectUrl !== '/auth/logout' && customRedirectUrl !== '/auth/login'
          ? customRedirectUrl
          : this.currentUrl,
    };
    const stateParam = Buffer.from(JSON.stringify(customParam)).toString('base64');
    const params = new URLSearchParams();
    params.append('client_id', this.clientId as string);
    params.append('scope', this.scope as string);
    params.append('response_type', 'code');
    params.append('redirect_uri', this.redirectUrl as string);
    params.append('state', stateParam);
    return `${this.authorizationDomain}/${this.tenantId}${this.authorizationEndpoint}?${params.toString()}`;
  }

  logOut() {
    window.location.replace(
      `${this.authorizationDomain}/${this.clientId}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.logoutUrl}`
    );
  }
}
