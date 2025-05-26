import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { kafka } from '../config/kafka.config'


@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  
  private consumer = kafka.consumer({ groupId: 'notification-group' });

  async onModuleInit() {
  
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'notify-user', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) return;
          const payload = JSON.parse(message.value.toString());
          const { userId, content } = payload;
    
          const io = global['io'];
          const connectedUsers = global['connectedUsers'];
          const socketId = connectedUsers.get(userId);
    
          if (socketId) {
            io.to(socketId).emit('notification', content);
          }
    
          // Future Improvement: Save notification into DB

        } catch (err) {
          console.error('Kafka consumer error:', err);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
