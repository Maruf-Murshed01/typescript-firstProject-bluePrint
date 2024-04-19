import { TAcademicSemesterCode, TAcademicSemisterName, TMonths, TacademicSemesterNameCodeMapper } from "./academicSemester.interface";

export const Months: TMonths[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const AcademicSemesterName: TAcademicSemisterName[] = ['Autumn', 'Summar', 'Fall']
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03']

export const academicSemesterNameCodeMapper: TacademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summar: '02',
    Fall: '03',
}