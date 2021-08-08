import Score from '../models/score';
import { FastifyInstance, RouteShorthandOptions, FastifyRequest, FastifyReply } from 'fastify';
import { IScore } from '../types/score';
import { IParams } from '../types/param';
import { calculateOne } from '../calculate';
import { calculateAll } from '../calculate';
import { ScoreRepoImpl } from '../repo/score-repo';
import { AvgRepoImpl } from '../repo/avg-repo';

//const { authJwt } = require("../middlewares/authJwt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const ScoreRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {
    const ScoreRepo: ScoreRepoImpl = ScoreRepoImpl.of();
    const AvgRepo: AvgRepoImpl = AvgRepoImpl.of();

    server.get('/scores', async (request, reply) => {
        try {
            const scores = await ScoreRepo.getScores();
            return reply.status(200).send({ scores });
        } catch (error) {
            console.error(`Get /scores ${error}`);
            return reply.status(500).send({ msg: `Something went wrong` });
        }
    });

    server.put<{ Params: IParams }>('/scores/:judgeId/:teamId', async (request, reply) => {
        const judgeId = request.params.judgeId;
        const teamId = request.params.teamId;
        const postBody: IScore = request.body as IScore;
        try {
            await ScoreRepo.updateScore(judgeId, teamId, postBody);

            await calculateOne(judgeId, teamId);
            await calculateAll();
            const scores = await ScoreRepo.getScoresByJudge(judgeId);
            return reply.status(200).send({ scores });
        } catch (error) {
            console.error(`PUT /scores/:judgeId/:teamId Error: ${error}`);
            return reply.status(500).send({ msg: `Something went wrong` });
        }
    });

    server.post<{ Params: IParams }>('/scores/submit/:judgeId', async (request, reply) => {
        const judgeId = request.params.judgeId;
        try {
            await Score.updateMany({ judgeId: judgeId }, { complete: true }).exec();
            await calculateAll();
            const scores = await ScoreRepo.getScoresByJudge(judgeId);
            return reply.status(200).send({ scores });
        } catch (error) {
            console.error(`POST /scores/submit/:judgeId Error: ${error}`);
            return reply.status(500).send({ msg: `Something went wrong` });
        }
    });

    server.get<{ Params: IParams }>('/scores/:judgeId', opts, async (request, reply) => {
        const judgeId: string = request.params.judgeId;
        let token = request.headers["x-access-token"];

        if (!token) {
            return reply.status(403).send({ message: "No token provided!" });
        }

        jwt.verify(token, config.secret, (err: any) => {    //type 'any' for err should be strange.
            if (err) {
            return reply.status(401).send({ message: "Unauthorized!" });
            }
        });

//        if(authJwt.verifyToken(request, reply))
        {
            try {
                const scores = await ScoreRepo.getScoresByJudge(judgeId);
                return reply.status(200).send({ scores });
            } catch (error) {
                console.error(`GET /scores/:judgeId Error: ${error}`);
                return reply.status(500).send({ msg: `Something went wrong` });
            }
        }
    });

    server.get('/scores/avg', async (request, reply) => {
        let token = request.headers["x-access-token"];

        if (!token) {
            return reply.status(403).send({ message: "No token provided!" });
        }

        jwt.verify(token, config.secret, (err: any) => {    //type 'any' for err should be strange.
            if (err) {
            return reply.status(401).send({ message: "Unauthorized!" });
            }
        });

//        if(authJwt.verifyToken(request, reply))
        {
            try {
                await calculateAll();
                const scoresAvg = await AvgRepo.getAvgs();
                return reply.status(200).send({ scoresAvg });
            } catch (error) {
                console.error(`GET /scores/avg ${error}`);
                return reply.status(500).send({ msg: `Something went wrong` });
            }
        }
    });

    done();
};

export { ScoreRouter };
