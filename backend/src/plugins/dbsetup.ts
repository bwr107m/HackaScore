import User from '../models/user';
import Score from '../models/score';
import Avg from '../models/avg';
import _ from 'lodash';
import { IScore } from '../types/score';

const InitCollection = async () => {
    const teamId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const judge = [1, 2, 3, 4, 5];
    const teamname = [
        '十萬青年十萬肝',
        'Bionic Beaver',
        '發財小貨車',
        '護國神山和他的爆肝IT小夥伴',
        '感謝台積電捐贈疫苗',
        '當哀鳳變踢鳳',
        '404NotFound',
        'Security H',
        'Java the Hutt',
        '隨便寫都隊',
        '暑假來登山'
    ];
    const topic = [
        '',
        'helpdesk 智能IT客服',
        '',
        '',
        'TSMC Enjoin',
        'Novice Friendly Chatbot',
        '菜積別怕',
        '',
        'TSMC OneStop',
        '',
        'TSMC 資訊交流平台 – GTT'
    ];

    const ToUser = (n: number) => {
        return { username: 'judge0' + n, password: 'pw4judge' };
    };
    const user = _.map(judge, ToUser);
    const oneUser = await User.findOne();
    if (oneUser == null) User.insertMany(user);

    const teamToAvg = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: 0,
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: []
        };
    };
    const avg = _.map(teamId, teamToAvg);
    const oneAvg = await Avg.findOne();
    if (oneAvg == null) await Avg.insertMany(avg);

    const teamToScore01 = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: '',
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: '',
            judgeId: '01',
            complete: false
        };
    };

    const teamToScore02 = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: '',
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: '',
            judgeId: '02',
            complete: false
        };
    };

    const teamToScore03 = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: '',
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: '',
            judgeId: '03',
            complete: false
        };
    };

    const teamToScore04 = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: '',
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: '',
            judgeId: '04',
            complete: false
        };
    };

    const teamToScore05 = (str: string) => {
        let d: number = teamId.indexOf(str);
        return {
            teamId: str,
            rank: '',
            name: teamname[d],
            topic: topic[d],
            maintain: 0,
            innov: 0,
            design: 0,
            skill: 0,
            demo: 0,
            result: 0,
            comment: '',
            judgeId: '05',
            complete: false
        };
    };

    let flag = false;
    const oneScore = await Score.findOne();
    if (oneScore == null) flag = true;

    const score01 = _.map(teamId, teamToScore01);
    if (flag) await Score.insertMany(score01);

    const score02 = _.map(teamId, teamToScore02);
    if (flag) await Score.insertMany(score02);

    const score03 = _.map(teamId, teamToScore03);
    if (flag) await Score.insertMany(score03);

    const score04 = _.map(teamId, teamToScore04);
    if (flag) await Score.insertMany(score04);

    const score05 = _.map(teamId, teamToScore05);
    if (flag) await Score.insertMany(score05);
};

export { InitCollection };
