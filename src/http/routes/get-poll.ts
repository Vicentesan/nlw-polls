import { db } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { FastifyInstance } from 'fastify'

import z from 'zod'

export async function GetPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (req, res) => {
    const getPollParamsSchema = z.object({
      pollId: z.string().cuid(),
    })

    const { pollId } = getPollParamsSchema.parse(req.params)

    const poll = await db.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!poll)
      return res
        .status(400)
        .send({ success: false, code: 404, message: 'Poll not found' })

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')
    const votes = result.reduce(
      (obj, line, i) => {
        if (i % 2 === 0) {
          const score = result[i + 1]

          Object.assign(obj, { [line]: Number(score) })
        }

        return obj
      },
      {} as Record<string, number>,
    )

    return res.status(200).send({
      success: true,
      code: 200,
      poll: {
        ...poll,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          }
        }),
      },
    })
  })
}
