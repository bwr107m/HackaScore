import { model, Schema } from 'mongoose'

const judgeSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        account: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        identity: {
            type: String,
            required: true
        }
    }
)

export default model("Judge", judgeSchema)