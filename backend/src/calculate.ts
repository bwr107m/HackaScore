import { ScoreRepoImpl } from './repo/score-repo';
import { AvgRepoImpl } from './repo/avg-repo';

const calculateOne = async (judgeId: string, teamId: string) => {
    const ScoreRepo: ScoreRepoImpl = ScoreRepoImpl.of();
    const record = await ScoreRepo.getSingleScore(judgeId, teamId);

    // 計算update的隊伍的總分
    let total = 0;
    total =
        record.maintain * 0.15 + record.innov * 0.15 + record.design * 0.35 + record.skill * 0.2 + record.demo * 0.15;
    record.result = total;
    await ScoreRepo.updateScore(judgeId, teamId, record);

    // 更新所有排名
    const scoreArray = await ScoreRepo.getScoresByJudge(judgeId);
    scoreArray.sort(function (a: any, b: any) {
        return b.result - a.result;
    });

    let ranknum = 1;
    scoreArray.forEach(async (team) => {
        team.rank = ranknum++;
        await ScoreRepo.updateScore(team.judgeId, team.teamId, team);
        //console.log(team.rank);
    });
};

const calculateAll = async () => {
    const ScoreRepo: ScoreRepoImpl = ScoreRepoImpl.of();
    const AvgRepo: AvgRepoImpl = AvgRepoImpl.of();

    const teamIdarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

    // 每個 team
    let flag = 1;
    //teamIdarray.forEach(async (teamId: string) => {
    // 可以使用array.map改寫
    for (let i = 0; i < teamIdarray.length; i++) {
        let teamId = teamIdarray[i];
        // console.log("I am 1 " + flag);
        const gradeList = await ScoreRepo.getScoresByTeam(teamId);
        // gradeList = [ {評審01的分數物件}, {評審02的分數物件}, {評審03的分數物件}, {評審04的分數物件}, {評審05的分數物件} ]
        const grade = await AvgRepo.getSingleAvg(teamId);
        // console.log("I am 2 " +flag);
        flag++;
        let maintain = 0;
        let innov = 0;
        let design = 0;
        let skill = 0;
        let demo = 0;
        let result = 0;
        let commentAll: string[] = [];
        const judgenum = gradeList.length;

        gradeList.forEach((element: any) => {
            maintain += element.maintain;
            innov += element.innov;
            design += element.design;
            skill += element.skill;
            demo += element.demo;
            result += element.result;

            commentAll.push(element.comment);
        });

        grade.maintain = maintain / judgenum;
        grade.innov = innov / judgenum;
        grade.design = design / judgenum;
        grade.skill = skill / judgenum;
        grade.demo = demo / judgenum;
        grade.result = result / judgenum;
        grade.comment = commentAll;
        await AvgRepo.updateAvg(teamId, grade);
    }
};

export { calculateOne, calculateAll };
