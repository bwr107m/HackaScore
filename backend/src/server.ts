import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { establishConnection } from './plugins/mongodb'
import Cat from './models/cat'
import Judge from './models/judge'
import Score from './models/score'
import { calculateOne}  from './calculate'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: { prettyPrint: true }
})

const startFastify: (port: number) => FastifyInstance<Server, IncomingMessage, ServerResponse> = (port) => {

    server.register(require('fastify-cors'), {})
    
    //@Server
    server.listen(port, (err, _) => {
        if (err) {
            console.error(err)
        }
        establishConnection()
    })

    //@Routes
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
        const judges = await Judge.find({}).exec()
        return reply.status(200).send({ judges })
    })

    server.post('/judges/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        let UID = postBody.username
        let pw = postBody.password

        const judge = await Judge.findOne({username:UID}).exec()
        if(judge === null)
            return reply.status(400).send({msg:"User '" + UID + "' not found"})
        else if(judge.password === pw)
            return reply.status(200).send({msg:"login success!"})
        else
            return reply.status(400).send({msg:"Password not correct"})
    })

    server.post('/judges/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({msg:"Log out success."})
    })

    server.get('/scores', async (request: FastifyRequest, reply: FastifyReply) => {
        const scores = await Score.find({}).exec()
        return reply.status(200).send({ scores })
    })

    server.get('/scores/:judgeId', async (request: FastifyRequest, reply: FastifyReply) => {
        let params:any = request.params
        let judgeId = params.judgeId
        const scores = await Score.find({"judgeId":judgeId}).exec()
        return reply.status(200).send({ scores })
    })

    server.put('/scores/update', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        await Score.updateOne( { "teamId": postBody.teamId, "judgeId":postBody.judgeId } , {$set:postBody.grades}).exec()

        await calculateOne(postBody)
        const scores = await Score.find({ "judgeId": postBody.judgeId }).exec()
        return reply.status(200).send({ scores })
    })

    server.post('/scores/submit/:judgeId', async (request: FastifyRequest, reply: FastifyReply) => {
        let params:any = request.params
        let judgeId = params.judgeId
        await Score.updateMany( { "judgeId":judgeId } , { "complete":"true" }).exec()
        const scores = await Score.find({}).exec()
        return reply.status(200).send({ scores })
    })


    return server
}

export { startFastify }