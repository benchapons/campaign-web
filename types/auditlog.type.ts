export type CreateLogType = {
  custKey?: string;
  channel?: string;
  service?: string;
  event?: string;
  eventTimestamp?: string;
  detailMessage?: string;
  from?: any;
  to?: any;
  createBy?: string;
  ownerId?: string;
};

export type KafkaMessageType = {
  value?: string;
};

export type AuditLogDataTyoe = {
  id: string | number;
  channel: string;
  custKey: string | number;
  service: string;
  event: string;
  eventTimestamp: string;
  detailMessage: string;
  from: string | null;
  to: string;
  createBy: string;
  timestamp: string;
  isExpend?: boolean;
};
