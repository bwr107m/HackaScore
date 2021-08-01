export interface GradeModel {
    _id?: number;
    teamId?: string;
    rank?: number;
    name?: string;
    topic?: string;
    maintain?: number;
    innov?: number;
    design?: number;
    skill?: number;
    demo?: number;
    result?: number;
    comment?: {};
    judgeId?: string;
    complete?: boolean;
}