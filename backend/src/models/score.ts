import { model, Schema } from 'mongoose'

const scoreSchema: Schema = new Schema(
    {
        _id: { type: Number, required: true },
        rank: { type: Number, required: false },
        team: { type: String, required: true },
        topic: { type: String, required: false },
        maintain: { type: Number, required: false },
        innov: { type: Number, required: false },
        design: { type: Number, required: false },
        skill: { type: Number, required: false },
        demo: { type: Number, required: false },
        result: { type: Number, required: false },
        comment: { type: String, required: false },
        judge: { type: String, required: true },
        complete: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

export default model("Score", scoreSchema)