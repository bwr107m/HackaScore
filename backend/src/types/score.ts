type IScore = {
    _id: string;
    teamId: string;
    rank: number;
    name: string;
    topic: string;
    maintain: number;
    innov: number;
    design: number;
    skill: number;
    demo: number;
    result: number;
    comment: string;
    judgeId: string;
    complete: boolean;
};

export { IScore };
