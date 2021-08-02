import { IAvg } from '../types/avg';
import Avg from '../models/avg';

interface AvgRepo {
    getAvgs(): Promise<Array<IAvg>>;
    getSingleAvg(judgeId: string, teamId: string): Promise<IAvg>;
    updateAvg(teamId: string, AvgBody: IAvg): Promise<IAvg>;
}

class AvgRepoImpl implements AvgRepo {
    private constructor() {}

    static of(): AvgRepoImpl {
        return new AvgRepoImpl();
    }

    async getAvgs(): Promise<Array<IAvg>> {
        return Avg.find();
    }

    async getSingleAvg(teamId: string): Promise<IAvg> {
        return Avg.findOne({ teamId: teamId });
    }

    async updateAvg(teamId: string, AvgBody: IAvg): Promise<IAvg> {
        return Avg.updateOne({ teamId: teamId }, { $set: AvgBody });
    }
}

export { AvgRepoImpl };
