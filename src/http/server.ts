import { env } from '@/env'
import fastify from 'fastify'
import { CreatePoll } from './routes/create-poll'
import { GetPoll } from './routes/get-poll'

export const app = fastify()

app.register(CreatePoll)
app.register(GetPoll)

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log('HTTP Server is Running!'))
