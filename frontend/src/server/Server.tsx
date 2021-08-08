import axios from 'axios'
import authHeader from './auth-header'

export default class Server {
  async getPersonalGradeForm(userId: string) {
    try {
      const res = await axios.get('http://localhost:8888/scores/' + userId, { headers: authHeader() })
      return res.data['scores']
    } catch (e) {
      alert(e)
    }
  }

  async getGeneralGradeForm() {
    try {
      const res = await axios.get('http://localhost:8888/scores/avg', { headers: authHeader() })
      return res.data['scoresAvg']
    } catch (e) {
      alert(e)
    }
  }

  async updateGradeForm(teamId: string, judgeId: string, grade: any) {
    try {
      const res = await axios.put('http://localhost:8888/scores/' + judgeId + '/' + teamId, grade)
      return res.data['scores']
    } catch (e) {
      alert(e)
    }
  }

  async updateUserAuthority(userId: string) {
    try {
      const res = await axios.post('http://localhost:8888/scores/submit/' + userId)
      return res.data['scores']
    } catch (e) {
      alert(e)
    }
  }
}
