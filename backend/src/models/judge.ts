import { model, Schema } from 'mongoose'

const judgeSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
)

export default model("Judge", judgeSchema)