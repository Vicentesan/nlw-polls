import { db } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'

import z from 'zod'

export async function VoteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (req, res) => {
    const voteOnPollParamsSchema = z.object({
      pollId: z.string().cuid(),
    })

    const voteOnPollBodySchema = z.object({
      optionId: z.string().cuid(),
    })

    const { pollId } = voteOnPollParamsSchema.parse(req.params)
    const { optionId } = voteOnPollBodySchema.parse(req.body)

    let { sessionId } = req.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await db.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.optionId !== optionId
      ) {
        await db.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        })
      } else if (userPreviousVoteOnPoll) {
        return res.status(409).send({
          success: false,
          code: 409,
          message: 'You already voted on this poll',
        })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      res.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      })
    }

    const vote = await db.vote.create({
      data: {
        sessionId,
        pollId,
        optionId,
      },
    })

    return res.send({ success: true, code: 201, vote })
  })
}
