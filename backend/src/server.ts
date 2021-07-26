import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { establishConnection } from './plugins/mongodb'
import Cat from './models/cat'
import Judge from './models/judge'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: { prettyPrint: true }
})

const startFastify: (port: number) => FastifyInstance<Server, IncomingMessage, ServerResponse> = (port) => {

    server.register(require('fastify-cors'), {})
    
    server.listen(port, (err, _) => {
        if (err) {
            console.error(err)
        }
        establishConnection()
    })

    server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ msg: 'pong' })
    })

    server.get('/cats', async (request: FastifyRequest, reply: FastifyReply) => {
        const cats = await Cat.find({}).exec()
        return reply.status(200).send({ cats })
    })
    
    server.post('/cats', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody = request.body
        const cat = await Cat.create(postBody)
        return reply.status(200).send({ cat })
    })

    server.get('/judges', async (request: FastifyRequest, reply: FastifyReply) => {
        const Judges = await Judge.find({}).exec()
        return reply.status(200).send({ Judges })
    })

    server.post('/judges', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody = request.body
        const judge = await Judge.create(postBody)
        return reply.status(200).send({ judge })
    })

    server.get('/login/:userId/:password', async (request: FastifyRequest, reply: FastifyReply) => {
        let param:any = request.params
        let UID = param.userId
        let pw = param.password

        const judge = await Judge.findOne({account:UID}).exec()
        if(judge === null)
            return reply.status(200).send({msg:"User '" + UID + "' not found"})
        else if(judge.password === pw)
            return reply.status(200).send({msg:"Access Granted"})
        else
            return reply.status(200).send({msg:"Password not correct"})
    })

    return server
}

export { startFastify }