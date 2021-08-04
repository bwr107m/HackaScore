import { FastifyInstance, InjectOptions } from 'fastify';
import { startFastify } from '../server';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as dbHandler from './db';

describe('API test', () => {
    let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

    beforeAll(async () => {
        try {
            await dbHandler.connect();
            server = startFastify(8888);
        } catch (error) {
            console.error(`Server start err: ${error}`);
        }
    });

    afterEach(async () => {
        try {
            await dbHandler.clearDatabase();
        } catch (error) {
            console.error(`ClearDatabase err: ${error}`);
        }
    });

    afterAll(async () => {
        try {
            await dbHandler.closeDatabase();
            server.close((): void => {});
            console.log('Closing Fastify server is done!');
        } catch (error) {
            console.log(`Failed to close a Fastify server, reason: ${error}`);
        }
    });

    // User GET API
    it('should successfully get a empty list of users', async () => {
        const response = await server.inject({ method: 'GET', url: '/users' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(JSON.stringify({ users: [] }));
    });

    // User PUT APi
    it('should successfully get a insert-success user object', async () => {
        const requestContent: InjectOptions = {
            method: 'PUT',
            url: '/users',
            payload: {
                username: 'testjudge01',
                password: 'testpw01'
            }
        };
        const response = await server.inject(requestContent);
        expect(response.statusCode).toBe(200);
        let obj = JSON.parse(response.body);
        let user = obj.user;
        expect(user.username).toStrictEqual('testjudge01');
        expect(user.password).toStrictEqual('testpw01');
    });

    it('should successfully get a login-success message', async () => {
        const requestContent: InjectOptions = {
            method: 'POST',
            url: '/users',
            payload: {
                username: 'testjudge02',
                password: 'testpw02'
            }
        };
        await server.inject(requestContent);

        const loginContent: InjectOptions = {
            method: 'POST',
            url: '/users/login',
            payload: {
                username: 'testjudge02',
                password: 'testpw02'
            }
        };
        const loginResponse = await server.inject(loginContent);

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body).toStrictEqual(JSON.stringify({ msg: 'login success!' }));
    });

    it('should successfully get a empty list of scores', async () => {
        const response = await server.inject({ method: 'GET', url: '/scores' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(JSON.stringify({ scores: [] }));
    });
});
