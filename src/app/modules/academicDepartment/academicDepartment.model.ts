import { Schema, model } from "mongoose";
import { config } from "dotenv";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty'
    }
}, {
    timestamps: true,
})


// intentionally commented out
academicDepartmentSchema.pre('save', async function (next) {
    const isDepartmentExist = await AcademicDepartment.findOne({ name: this.name })

    if (isDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This department is already exists!')
    }

    next()
})

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery()//id ta chole asbe etar maddhome

    const isDepartmentExist = await AcademicDepartment.findOne(query)

    if (!isDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This department does not exist!')
    }

    next()
})

export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)