import axios from 'axios';

export default class Server {
    async getGradeForm() {
        try {
            const res = await axios.get('http://localhost:8888/score');
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }

    async updateGradeForm(team: string, judge: string, grades: any) {   
        console.log(team, judge)
        try {
            const res = await axios.put('http://localhost:8888/score/save', {
                _team: team,
                _judge: judge,
                _grades: grades
            });
            return res.data['scores'];
        } catch (e) {
            alert(e);
        }
    }
}