import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { kafka } from '../config/kafka.config';
import { Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private isConnected = false;

  constructor() {
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    if (!this.isConnected) {
      try {
        await this.producer.connect();
        this.isConnected = true;
        console.log('[KafkaProducer] Connected');
      } catch (error) {
        console.error('[KafkaProducer] Connection failed:', error);
        throw error;
      }
    }
  }

  async sendMessage(topic: string, payload: any) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
      });
    } catch (error) {
      console.error(`[KafkaProducer] Failed to send message to topic ${topic}:`, error);
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('[KafkaProducer] Disconnected');
    }
  }
}
