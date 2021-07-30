import { model, Schema } from 'mongoose'

const avgSchema: Schema = new Schema(
    {
        _id: { type: Number, required: true },
        teamId: { type: String, required: true },
        rank: { type: Number, required: false },
        name: { type: String, required: true },
        topic: { type: String, required: false },
        maintain: { type: Number, required: false },
        innov: { type: Number, required: false },
        design: { type: Number, required: false },
        skill: { type: Number, required: false },
        demo: { type: Number, required: false },
        result: { type: Number, required: false },
        comment: { type: String, required: false },
        complete: { type: Boolean, required: true },
    },
    {
        timestamps: true
    }
)

export default model("Avg", avgSchema)