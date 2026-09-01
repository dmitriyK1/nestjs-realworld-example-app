import type { IncomingMessage, ServerResponse } from 'http';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createApp } from '../src/create-app';

let appPromise: Promise<NestFastifyApplication> | undefined;

function bootstrap(): Promise<NestFastifyApplication> {
  if (!appPromise) {
    appPromise = createApp().then(async (app) => {
      await app.init();
      return app;
    });
  }
  return appPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await bootstrap();
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
