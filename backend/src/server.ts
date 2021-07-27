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

    server.post('/addjudge', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody = request.body
        const judge = await Judge.create(postBody)
        return reply.status(200).send({ judge })
    })

    // login 應使用 post 之類的 method 較為安全
    server.get('/login/:userId/:password', async (request: FastifyRequest, reply: FastifyReply) => {
        let param:any = request.params
        let UID = param.userId
        let pw = param.password

        const judge = await Judge.findOne({account:UID}).exec()
        if(judge === null)
            return reply.status(200).send({msg:"User '" + UID + "' not found"})
        else if(judge.password === pw)
            return reply.status(200).send({msg:"login success!"})
        else
            return reply.status(200).send({msg:"Password not correct"})
    })

    // login-post
    server.post('/judgelogin', async (request: FastifyRequest, reply: FastifyReply) => {
        const postBody:any = request.body
        let UID = postBody.userId
        let pw = postBody.password

        const judge: { account:string, password: string; } = { account:"judge01", password: "pw4judge" };
        if(judge.account === UID && judge.password === pw)
            return reply.status(200).send({msg:"login success!"})
        else if(judge.account !== UID )
            return reply.status(200).send({msg:"User '" + UID + "' not found"})
        else
            return reply.status(200).send({msg:"Password not correct"})
        //const judge = await Judge.findOne({account:UID}).exec()
        // if(judge === null)
        //     return reply.status(200).send({msg:"User '" + UID + "' not found"})
        // else if(judge.password === pw)
        //     return reply.status(200).send({msg:"login success!"})
        // else
        //     return reply.status(200).send({msg:"Password not correct"})
    })

    // login-post
    server.post('/judgelogout', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({msg:"Log out success."})
    })


    // create new score record
    server.post('/score', async (request: FastifyRequest, reply: FastifyReply) => {
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

    // update one score record
    server.put('/score/update', async (request: FastifyRequest, reply: FastifyReply) => {
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