import { IScore } from '../types/score';
import Score from '../models/score';

interface ScoreRepo {
    getScores(): Promise<Array<IScore>>;
    addScore(ScoreBody: IScore): Promise<IScore>;
    getSingleScore(judgeId: string, teamId: string): Promise<IScore>;
    getScoresByJudge(id: string): Promise<Array<IScore>>;
    getScoresByTeam(id: string): Promise<Array<IScore>>;
    updateScore(judgeId: string, teamId: string, ScoreBody: IScore): Promise<IScore>;
    getScoresByTeam(id: string): Promise<Array<IScore>>;
    deleteScore(id: string): Promise<IScore | null>;
}

class ScoreRepoImpl implements ScoreRepo {
    private constructor() {}

    static of(): ScoreRepoImpl {
        return new ScoreRepoImpl();
    }

    async getScores(): Promise<Array<IScore>> {
        return Score.find();
    }

    async addScore(ScoreBody: IScore): Promise<IScore> {
        return Score.create(ScoreBody);
    }

    async getSingleScore(judgeId: string, teamId: string): Promise<IScore> {
        return Score.findOne({ judgeId: judgeId, teamId: teamId });
    }

    async getScoresByJudge(id: string): Promise<Array<IScore>> {
        return Score.find({ judgeId: id });
    }

    async getScoresByTeam(id: string): Promise<Array<IScore>> {
        return Score.find({ teamId: id });
    }

    async updateScore(judgeId: string, teamId: string, ScoreBody: IScore): Promise<IScore> {
        // return Score.findByIdAndUpdate(
        //     id, ScoreBody, { new: true }
        // )
        return Score.updateOne({ judgeId: judgeId, teamId: teamId }, { $set: ScoreBody });
    }

    async deleteScore(id: string): Promise<IScore | null> {
        return Score.findByIdAndDelete(id);
    }
}

export { ScoreRepoImpl };
