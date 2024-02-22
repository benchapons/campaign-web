import { CreateLogType, KafkaMessageType } from '@/types/auditlog.type';
import { KafkaService } from './kafka.service';

export async function createLog(auditLog: CreateLogType) {
  const dataForCreateAuditLog = {
    ...auditLog,
    channel: 'CAMPAIGN',
    service: 'campaignService',
    eventTimestamp: new Date().toISOString(),
  };

  const kafkaService = new KafkaService();
  const items: KafkaMessageType[] = [{ value: JSON.stringify(dataForCreateAuditLog) }];
  return await kafkaService.sendMessage(items);
}
