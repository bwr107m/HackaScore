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
            const res = await axios.put('http://localhost:8888/scores/update', {
                teamId: teamId,
                judgeId: judgeId,
                grades: grades
            });
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }
}