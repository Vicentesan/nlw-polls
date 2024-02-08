import { voting } from '@/utils/voting-pub-sub'
import { FastifyInstance } from 'fastify'
import z from 'zod'

export async function PollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true }, (connection, req) => {
    // Subscribes to messages published on the channel of the specified poll (pollId).
    const getPollParamsSchema = z.object({
      pollId: z.string().cuid(),
    })

    const { pollId } = getPollParamsSchema.parse(req.params)

    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}
