import { model, Schema } from 'mongoose'

const scoreSchema: Schema = new Schema(
    {
        rank: { type: Number, required: false },
        team: { type: String, required: true },
        topic: { type: String, required: false },
        sub1: { type: Number, required: false },
        sub2: { type: Number, required: false },
        sub3: { type: Number, required: false },
        sub4: { type: Number, required: false },
        sub5: { type: Number, required: false },
        totalavg: { type: Number, required: false },
        comment: { type: String, required: false },
        judge: { type: String, required: true },
        edition: { type: String, required: true }
    }
)

export default model("Score", scoreSchema)