import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find()
        // .populate('preRequisiteCourses.course')
        , query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await courseQuery.modelQuery;
    return result;
}

const getSingleCoursesFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession()

    try {
        session.startTransaction();

        //step 1: update baseic course info
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session
            }
        )

        if (!updatedBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
        }


        console.log(preRequisiteCourses)

        //check there if any pre-requisites courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            //filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course)
            console.log(deletedPreRequisites);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id,
                {
                    $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } }
                }, {
                new: true,
                runValidators: true,
                session
            }
            )


            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
            }


            //filter out new course fields
            const newPreRequisites = preRequisiteCourses?.filter(el => el.course && !el.isDeleted)
            console.log({ newPreRequisites })

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newPreRequisites }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            )

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
            }


        }

        await session.commitTransaction();
        await session.endSession()

        const result = await Course.findById(id).populate('preRequisiteCourses.course')

        return result;
    } catch (err) {

        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
    }




}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result;
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCoursefaculty>) => {

    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: {
                faculties: { $each: payload }
            }
        },
        {
            upsert: true,
            new: true
        }
    )

    return result;
}

const removeFacultiesFromCourseIntoDB = async (id: string, payload: Partial<TCoursefaculty>) => {

    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        {
            new: true
        }
    )

    return result;
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCoursesFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseIntoDB
}