import { model, Schema } from 'mongoose';

const avgSchema: Schema = new Schema(
    {
        _id: { type: Number, required: true },
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
        comment: { type: [] }
    },
    {
        timestamps: true
    }
);

export default model('Avg', avgSchema);
