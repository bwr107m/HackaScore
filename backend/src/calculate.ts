import Score from './models/score'
import Avg from './models/avg'

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
    const teamId = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ]
    const col = [ "maintain", "innov", "design", "skill" , "demo", "result" ]
    const judgenum = 5

    // 每組 各評審的 5個項目+1個總分
    // let oneTeam = await Score.find({"teamId":teamId[0]}).exec()
    // let record = oneTeam[0]
    // let colname = col[0]
    // console.log(record)
    // console.log(colname)
    // console.log("goinghere")
    // console.log(record[colname])
    
    // 每個 team
    for(let i=0; i<teamId.length; i++){
        let oneTeam = await Score.find({"teamId":teamId[i]}).exec()
        // 每個 subject
        for(let j=0; j<col.length; j++){
            let sum = 0
            let commentobj:any = {}
            // 每個評審
            for(let k=0; k<judgenum; k++){
                // 分數加總
                let record = oneTeam[k]
                let colname = col[j]
                sum = sum + record[colname]

                // comment彙整
                let judgeId = record.judgeId
                commentobj[judgeId] = record.comment
            }
            let avgscore = sum / judgenum
            let colname = col[j]
            let obj:any = {}
            obj[colname] = avgscore
            obj["comment"] = JSON.stringify(commentobj)
            await Avg.updateOne( { "teamId":teamId[i] } , {$set:obj}).exec()
        }
    }
}

export {calculateOne}
export {calculateAll}