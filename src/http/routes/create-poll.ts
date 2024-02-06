import { db } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'

import z from 'zod'

export async function CreatePoll(app: FastifyInstance) {
  app.post('/polls', async (req, res) => {
    const createPollBodySchema = z.object({
      title: z.string(),
      options: z.string().array(),
    })

    const { title, options } = createPollBodySchema.parse(req.body)

    const newPoll = await db.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option }
            }),
          },
        },
      },
    })

    return res.status(201).send({ success: true, pollId: newPoll.id })
  })
}
