import { env } from '@/env'
import fastify from 'fastify'

export const app = fastify()

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log('HTTP Server is Running!'))
