import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { establishConnection } from './plugins/mongodb';
import { UserRouter } from './routes/user';
import { ScoreRouter } from './routes/score';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: { prettyPrint: true }
});

const startFastify: (port: number) => FastifyInstance<Server, IncomingMessage, ServerResponse> = (port) => {
    server.register(require('fastify-cors'), {});

    //@Server
    server.listen(port, (err, _) => {
        if (err) {
            console.error(err);
        }
        establishConnection();
    });

    //@Routes
    server.register(UserRouter);
    server.register(ScoreRouter);

    return server;
};

export { startFastify };
