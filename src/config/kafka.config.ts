import { Kafka } from 'kafkajs';

export const kafka = new Kafka({

  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  
});