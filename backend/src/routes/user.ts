import { FastifyInstance, RouteShorthandOptions, FastifyRequest, FastifyReply } from 'fastify';
import { IUser } from '../types/user';
import { UserRepoImpl } from '../repo/user-repo';

const UserRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {
    const UserRepo: UserRepoImpl = UserRepoImpl.of();

    server.get('/users', async (request, reply) => {
        const users = await UserRepo.getUsers();
        return reply.status(200).send({ users });
    });

    // add a new user
    server.post('/users', async (request, reply) => {
        const postBody: IUser = request.body as IUser;
        const user = await UserRepo.addUser(postBody);
        return reply.status(200).send({ user });
    });

    server.post('/users/login', async (request, reply) => {
        const postBody: IUser = request.body as IUser;
        let UID = postBody.username;
        let pw = postBody.password;

        const user = await UserRepo.getSingleUser(UID);
        if (user === null) {
            return reply.status(205).send({ msg: 'User ' + UID + ' not found' });
        } else if (user.password === pw) {
            return reply.status(200).send({ msg: 'login success!' });
        } else {
            return reply.status(206).send({ msg: 'Password not correct' });
        }
    });

    server.post('/users/logout', async (request, reply) => {
        return reply.status(200).send({ msg: 'Log out success.' });
    });

    done();
};

export { UserRouter };
