export enum SystemConnectType {
  AZURE_AD = 'AZURE_AD',
  MASTER_VLC = 'MASTER_VLC',
  CAMPAIGN_SERVICE = 'CAMPAIGN_SERVICE',
  RECEIPT_TANK = 'RECEIPT_TANK',
}

export type VlcHealthCheckType<T> = {
  status: 'ok' | 'error';
  program: SystemConnectType;
  msg?: T;
};

export type LivenessHealthCheckType<T> = {
  status: 'ok' | 'error';
  program: SystemConnectType;
  info: {
    memory_heap: {
      status: string;
    };
    memory_rss: {
      status: string;
    };
  };
  error: {};
  details: {
    memory_heap: {
      status: string;
    };
    memory_rss: {
      status: string;
    };
  };
  msg?: T;
};
