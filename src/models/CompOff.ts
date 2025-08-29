import mongoose, { Document, Schema } from "mongoose";

interface ICompOff extends Document {
    user: mongoose.Types.ObjectId;
    count: number;
}

const compoffSchema: Schema<ICompOff> = new Schema<ICompOff>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    count: { type: Number, default: 0 }
})

const CompOff = mongoose.model<ICompOff>('CompOff', compoffSchema)
export default CompOff