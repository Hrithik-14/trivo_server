import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPayslip extends Document {
    employeeName: string;
    employeeCode: string;
    designation: string;
    email: string;
    phoneNumber: string;
    salaryDate: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    basicSalary: number;
    allowance: number;
    netSalary: number;
    tax: number;
    incentive: number;
    bonus: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const PayslipSchema: Schema<IPayslip> = new Schema(
    {
        employeeName: { type: String, required: true },
        employeeCode: { type: String, required: true },
        designation: { type: String },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        salaryDate: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String },
        basicSalary: { type: Number, required: true },
        allowance: { type: Number, required: true },
        netSalary: { type: Number, required: true },
        tax: { type: Number, required: true },
        bonus: { type: Number, required: true },
        incentive: { type: Number, required: true },
    },
    { timestamps: true }
);

const Payslip: Model<IPayslip> = mongoose.model<IPayslip>('Payslip', PayslipSchema);
export default Payslip;
