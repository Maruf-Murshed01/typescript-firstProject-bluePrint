import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model"

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
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

    //step 1: update baseic course info
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
        id,
        courseRemainingData,
        {
            new: true,
            runValidators: true
        }
    )

    console.log(preRequisiteCourses)

    //check there if any pre-requisites courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        //filter out the deleted fields
        const deletedPreRequisites = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course)
        console.log(deletedPreRequisites);

        const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id,
            {
                $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } }
            }
        )


        //filter out new course fields
        const newPreRequisites = preRequisiteCourses?.filter(el => el.course && !el.isDeleted)
        console.log({ newPreRequisites })

        const newPreRequisiteCourses = await Course.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    preRequisiteCourses: { $each: newPreRequisites }
                }
            }
        )
    }


    const result = await Course.findById(id).populate('preRequisiteCourses.course')

    return result;
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result;
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCoursesFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB
}