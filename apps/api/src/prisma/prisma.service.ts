import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to database successfully');
    } catch (err) {
      console.error('❌ Database connection failed during init:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }
}
