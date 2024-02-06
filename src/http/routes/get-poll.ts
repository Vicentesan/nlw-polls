import { db } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'

import z from 'zod'

export async function GetPoll(app: FastifyInstance) {
  app.get('/polls/:id', async (req, res) => {
    const getPollParamsSchema = z.object({
      id: z.string().cuid(),
    })

    const { id } = getPollParamsSchema.parse(req.params)

    const poll = await db.poll.findUnique({
      where: {
        id,
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
      res
        .status(404)
        .send({ success: false, code: 404, message: 'Poll not found' })

    return res.status(200).send({ success: true, code: 200, poll })
  })
}
