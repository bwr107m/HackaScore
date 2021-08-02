import { model, Schema } from 'mongoose';

const scoreSchema: Schema = new Schema(
    {
        teamId: { type: String, required: true },
        rank: { type: Number },
        name: { type: String, required: true },
        topic: { type: String },
        maintain: { type: Number },
        innov: { type: Number },
        design: { type: Number },
        skill: { type: Number },
        demo: { type: Number },
        result: { type: Number },
        comment: { type: String },
        judgeId: { type: String, required: true },
        complete: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

export default model('Score', scoreSchema);
