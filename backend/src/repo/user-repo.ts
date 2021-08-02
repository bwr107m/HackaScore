import { IUser } from '../types/user';
import User from '../models/user';

interface UserRepo {
    getUsers(): Promise<Array<IUser>>;
    addUser(UserBody: IUser): Promise<IUser>;
    getSingleUser(username: string): Promise<IUser>;
    updateUser(id: string, UserBody: IUser): Promise<IUser | null>;
    deleteUser(id: string): Promise<IUser | null>;
}

class UserRepoImpl implements UserRepo {
    private constructor() {}

    static of(): UserRepoImpl {
        return new UserRepoImpl();
    }

    async getUsers(): Promise<Array<IUser>> {
        return User.find();
    }

    async getSingleUser(username: string): Promise<IUser> {
        return User.findOne({ username: username });
    }

    async addUser(UserBody: IUser): Promise<IUser> {
        return User.create(UserBody);
    }

    async updateUser(id: string, UserBody: IUser): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, UserBody, { new: true });
    }

    async deleteUser(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}

export { UserRepoImpl };
