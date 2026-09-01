import type { Handler } from 'aws-lambda';
import awsLambdaFastify from '@fastify/aws-lambda';
import { createApp } from '../../src/create-app';

type ProxyHandler = (event: unknown, context: unknown) => Promise<unknown>;

let cachedProxy: ProxyHandler | undefined;

async function bootstrap(): Promise<ProxyHandler> {
  if (!cachedProxy) {
    const app = await createApp();
    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedProxy = awsLambdaFastify(
      app.getHttpAdapter().getInstance() as any,
    ) as ProxyHandler;
  }
  return cachedProxy;
}

export const handler: Handler = async (event, context) => {
  const proxy = await bootstrap();
  return proxy(event, context);
};
