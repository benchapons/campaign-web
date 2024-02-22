import { KafkaMessageType } from '@/types/auditlog.type';
import { LoggerService } from './logger.service';
const { Kafka } = require('kafkajs');

export class KafkaService {
  private producer: any;
  private kafkaTopic?: string;
  private loggerService;
  constructor() {
    this.loggerService = new LoggerService();
    this.kafkaTopic = process.env.KAFKA_TOPIC;
    const kafka = new Kafka({
      clientId: 'campaign',
      brokers: [process.env.KAFKA_BROKER_1, process.env.KAFKA_BROKER_2, process.env.KAFKA_BROKER_3],
      retry: 9,
    });
    this.producer = kafka.producer({ metadataMaxAge: 60000 });
  }

  async sendMessage(messages: KafkaMessageType[]) {
    this.loggerService.info('kafka sendMessage', messages);
    await this.producer.connect();
    const result = await this.producer.send({
      topic: this.kafkaTopic,
      messages,
      acks: 1,
    });
    this.loggerService.error('kafka result', result);
    await this.producer.disconnect();
    return result;
  }
}
