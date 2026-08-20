import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const defaultDbUrl = 'postgresql://postgres:Gofm50018kartik@db.rytpjptemiedslnnmlvh.supabase.co:5432/postgres';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || defaultDbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Supabase PostgreSQL database');
    } catch (err) {
      console.error('❌ Database connection failed:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }
}
