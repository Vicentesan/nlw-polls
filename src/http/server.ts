import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from '@/env'

import { CreatePoll } from './routes/create-poll'
import { GetPoll } from './routes/get-poll'
import { VoteOnPoll } from './routes/vote-on-poll'
import { fastifyWebsocket } from '@fastify/websocket'
import { PollResults } from './ws/poll-results'

export const app = fastify()

app.register(cookie, {
  secret: env.COOKIE_SECRET,
  hook: 'onRequest',
})

app.register(fastifyWebsocket)

app.register(CreatePoll)
app.register(GetPoll)
app.register(VoteOnPoll)

app.register(PollResults)

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log('HTTP Server is Running!'))
