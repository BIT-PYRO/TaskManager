import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Gofm50018kartik@db.rytpjptemiedslnnmlvh.supabase.co:5432/postgres';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || 'https://task-manager-web-khaki.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie',
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!cachedServer) {
      const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

      app.enableCors({
        origin: (requestOrigin: any, callback: any) => callback(null, true),
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization, Cookie',
      });

      app.use(cookieParser());
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      await app.init();
      cachedServer = app.getHttpAdapter().getInstance();
    }

    return cachedServer(req, res);
  } catch (err: any) {
    console.error('Serverless Handler Error:', err);
    return res.status(500).json({
      statusCode: 500,
      message: err.message || 'Internal Server Error',
      error: err.stack || 'ServerlessInvocationError',
    });
  }
}
