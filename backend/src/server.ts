import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { establishConnection } from './plugins/mongodb'
import Cat from './models/cat'
import Judge from './models/judge'
import Score from './models/score'

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

    //純測試用
    server.get('/judge', async (request: FastifyRequest, reply: FastifyReply) => {
        const judges = await Judge.find({}).exec()
        return reply.status(200).send({ judges })
    })
    
    // add a new judge
    server.post('/judge', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody = request.body
        const judge = await Judge.create(postBody)
        return reply.status(200).send({ judge })
    })

    server.post('/judge/login', async (request: FastifyRequest, reply: FastifyReply) => {
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

    server.post('/judge/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({msg:"Log out success."})
    })

    //純測試用
    server.get('/score', async (request: FastifyRequest, reply: FastifyReply) => {
        const scores = await Score.find({}).exec()
        return reply.status(200).send({ scores })
    })

    server.post('/score/getscore', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        let judgenum = postBody.judge
        const scores = await Score.find({"judge":judgenum}).exec()
        return reply.status(200).send({ scores })
    })

    server.put('/score/save', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        let judge = postBody.judge
        let team = postBody.team
        const scores = await Score.updateOne( { "judge":judge, "team":team } , {$set:postBody}).exec()
        return reply.status(200).send({ scores })
    })

    server.put('/score/submit', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        let judge = postBody.judge
        let team = postBody.team
        postBody.complete = "true"
        const scores = await Score.updateOne( { "judge":judge, "team":team } , {$set:postBody}).exec()
        return reply.status(200).send({ scores })
    })


    return server
}

export { startFastify }