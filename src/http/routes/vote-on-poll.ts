import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
        pollId: z.string().uuid(),
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    let { sessionId } = request.cookies

    if (sessionId) {
      const usePreviousVouteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId: sessionId,
            pollId: pollId
          }
        }
      })

      if (usePreviousVouteOnPoll && usePreviousVouteOnPoll.pollOptionId !== pollOptionId) {
        // Apagar o voto anterior
        // Criar um novo
        
        await prisma.vote.delete({
          where: {
            id: usePreviousVouteOnPoll.id
          }
        })

      } else if (usePreviousVouteOnPoll) {
        return reply.status(400).send({ message: 'You already voted on this poll.' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      }
    })
        

    return reply.status(201).send()
  })
}
