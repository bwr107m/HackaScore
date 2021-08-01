import Score from './models/score'
import Avg from './models/avg'
import judge from './models/judge'
import { GradeModel } from './models/gradeModel'
import { TeamModel } from './models/teamModel'

const calculateOne = async (obj:any) => {

    let judgeId = obj.judgeId
    let teamId = obj.teamId
    const onejudge = await Score.findOne({"judgeId":judgeId, "teamId":teamId}).exec()
    
    // 計算update的隊伍的總分
    let total = 0
    total = onejudge.maintain * 0.15 + onejudge.innov * 0.15 + onejudge.design * 0.35 + onejudge.skill * 0.2 + onejudge.demo * 0.15
    onejudge.result = total
    await Score.updateOne( { "teamId": teamId, "judgeId":judgeId } , {$set:{"result":total}}).exec()

    // 更新所有排名
    const scoreArray = await Score.find({"judgeId":judgeId}).exec()
    scoreArray.sort(function (a: any, b: any) {
        return b.result - a.result;
    });

    for (let i=0; i<scoreArray.length; i++){
        scoreArray[i].rank = i+1
    }
    
    for (let i=0; i<scoreArray.length; i++){
        let tmpjudge = scoreArray[i].judgeId
        let tmpteam = scoreArray[i].teamId
        let tmprank = scoreArray[i].rank
        await Score.updateOne( { "judgeId":tmpjudge, "teamId":tmpteam } , {$set:{"rank":tmprank }}).exec()
    }
}

const calculateAll = async () => {
    const oneTeam: TeamModel = {
        gradeList: []
    };

    const gradeModel: GradeModel = {
        maintain: Number(),
        innov: Number(),
        design: Number(),
        skill: Number(),
        demo: Number(),
        result: Number(),
        comment: []
    }
    
    const teamIdobj = await Avg.find({}, {"teamId":1, "_id":0}).exec()
    // console.log(teamIdobj)
    /*
    teamIdobj = [
        { teamId: 'A' }, { teamId: 'B' }, { teamId: 'C' }, { teamId: 'D' },
        { teamId: 'E' }, { teamId: 'F' }, { teamId: 'G' }, { teamId: 'H' },
        { teamId: 'I' }, { teamId: 'J' }, { teamId: 'K' }
    ]
    */

    // 每個 team
    teamIdobj.forEach(async (team: any) => {
        oneTeam.gradeList = await Score.find({"teamId":team.teamId}).exec()
        // oneTeam = [ {評審01的分數物件}, {評審02的分數物件}, {評審03的分數物件}, {評審04的分數物件}, {評審05的分數物件} ]
        let maintain = 0, innov = 0, design = 0, skill = 0, demo = 0, result = 0
        let commentAll:string[] = []
        const judgenum = oneTeam.gradeList.length

        oneTeam.gradeList.forEach((element: any) => {
            maintain += element.maintain
            innov += element.innov
            design += element.design
            skill += element.skill
            demo += element.demo 
            result += element.result

            commentAll.push(element.comment)
        });

        gradeModel.maintain = maintain / judgenum
        gradeModel.innov = innov / judgenum
        gradeModel.design = design /judgenum
        gradeModel.skill = skill / judgenum
        gradeModel.demo = demo / judgenum
        gradeModel.result = result / judgenum
        gradeModel.comment = commentAll
        await Avg.updateOne( { "teamId":team.teamId } , {$set:gradeModel}).exec()
    })
}

export {calculateOne}
export {calculateAll}