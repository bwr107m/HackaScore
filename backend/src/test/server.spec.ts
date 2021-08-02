import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
 
describe('API test', () => {
    let server: FastifyInstance<Server, IncomingMessage, ServerResponse>
 
    beforeAll(async () => {
        await dbHandler.connect()
        server = startFastify(8888)
    })
    
    afterEach(async () => {
        await dbHandler.clearDatabase()
    })
    
    afterAll(async () => {
        try {
            await dbHandler.closeDatabase()
            server.close((): void => { })
            console.log('Closing Fastify server is done!')
        } catch (e) {
            console.log(`Failed to close a Fastify server, reason: ${e}`)
        }
    })

    it('should successfully get a empty list of judges', async () => {
        const response = await server.inject({ method: 'GET', url: '/judges' })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(JSON.stringify({ judges: [] }))
    })

    it('should successfully get a insert-success judge object', async () => {
        const requestContent:any = {
            method: 'POST',
            url: '/judges',
            payload: {
              username: 'testjudge01',
              password: 'testpw'
            }
        }
        const response = await server.inject(requestContent)
        expect(response.statusCode).toBe(200)
        let obj = JSON.parse(response.body)
        let judge = obj.judge
        expect(judge.username).toStrictEqual("testjudge01")
        expect(judge.password).toStrictEqual("testpw")
    })

    it('should successfully get a login-success message', async () => {
        const requestContent:any = {
            method: 'POST',
            url: '/judges',
            payload: {
              username: 'testjudge01',
              password: 'testpw'
            }
        }
        const response = await server.inject(requestContent)
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({msg:"login success!"})
    })

    it('should successfully get a empty list of scores', async () => {
        const response = await server.inject({ method: 'GET', url: '/scores' })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(JSON.stringify({ scores: [] }))
    })

    it('should successfully get login message', async () => {
        const content:any = {
            method: 'POST',
            url: '/judges/login',
            payload: {
              username: 'judge01',
              password: 'pw4judge'
            }
        }
        const response = await server.inject(content)
        //const response = await server.inject({ method: 'POST', url: '/judges/login'})
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(JSON.stringify({ msg:"login success!" }))
    })

})