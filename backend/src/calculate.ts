import Score from './models/score'

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

export {calculateOne}