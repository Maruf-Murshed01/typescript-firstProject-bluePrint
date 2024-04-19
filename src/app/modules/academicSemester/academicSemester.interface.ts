export type TMonths = "January" | "February" | "March" | "April" |
    "May" | "June" | "July" | "August" | "September" |
    "October" | "November" | "December";

export type TAcademicSemisterName = 'Autumn' | 'Summar' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';

export type TAcademicSemester = {
    name: TAcademicSemisterName;
    code: TAcademicSemesterCode;
    year: string;
    startMonth: TMonths;
    endMonth: TMonths;
}

export type TacademicSemesterNameCodeMapper = {
    [key: string]: string
}