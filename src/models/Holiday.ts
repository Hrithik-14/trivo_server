import mongoose, { Document, Schema } from 'mongoose';


interface IHoliday extends Document {
    date: Date;
    description: string;
}


const holidaySchema: Schema<IHoliday> = new Schema<IHoliday>({
    date: { type: Date, required: true },
    description: { type: String, required: true }
})

const Holiday = mongoose.model<IHoliday>('Holiday', holidaySchema)
export default Holiday