import axios from 'axios';

export default class Server {
    async getGradeForm() {
        try {
            const res = await axios.get('http://localhost:8888/scores/01');
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }

    async updateGradeForm(teamId: string, judgeId: string, grades: any) {   
        console.log(teamId, judgeId)
        try {
            grades.teamId = teamId
            grades.judgeId = judgeId
            const res = await axios.put('http://localhost:8888/scores/update', grades);
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }

    async updateUserAuthority(){
        try{
            const res = await axios.post('http://localhost:8888/scores/submit/01');
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }
}