import { z } from "zod";


//create validation
const createUserNameValidationSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(20, 'First name cannot exceed 20 characters'),
    middlename: z.string().trim().optional(),
    lastname: z
        .string()
        .trim()
        .min(1, 'Last name is required'),
});

const createGuardianValidationSchema = z.object({
    fatherName: z.string().trim().min(1, 'Father\'s name is required'),
    fatherOccupation: z.string().trim().min(1, 'Father\'s occupation is required'),
    fatherContactNo: z.string().trim().min(1, 'Father\'s contact number is required'),
    motherName: z.string().trim().min(1, 'Mother\'s name is required'),
    motherOccupation: z.string().trim().min(1, 'Mother\'s occupation is required'),
    motherContactNo: z.string().trim().min(1, 'Mother\'s contact number is required'),
});

const createLocalGuardianValidationSchema = z.object({
    name: z.string().trim().min(1, 'Local guardian\'s name is required'),
    occupation: z.string().trim().min(1, 'Local guardian\'s occupation is required'),
    contactNo: z.string().trim().min(1, 'Local guardian\'s contact number is required'),
    address: z.string().trim().min(1, 'Local guardian\'s address is required'),
});

export const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        student: z.object({
            name: createUserNameValidationSchema,
            gender: z.enum(['male', 'female', 'others']),
            dateOfBirth: z.string().optional(),
            email: z.string().trim().email('Invalid email format'),
            contactNo: z.string().trim().min(1, 'Contact number is required'),
            emergencyContactNo: z.string().trim().min(1, 'Emergency contact number is required'),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            presentAddress: z.string().trim().min(1, 'Present address is required'),
            permanentAddress: z.string().trim().min(1, 'Permanent address is required'),
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            admissionSemester: z.string(),
            profileImg: z.string().trim().optional(),
        })
    })
})





//update validation
const updateUserNameValidationSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(20, 'First name cannot exceed 20 characters')
        .optional(),
    middlename: z.string().trim().optional(),
    lastname: z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .optional(),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().trim().min(1, 'Father\'s name is required').optional(),
    fatherOccupation: z.string().trim().min(1, 'Father\'s occupation is required').optional(),
    fatherContactNo: z.string().trim().min(1, 'Father\'s contact number is required').optional(),
    motherName: z.string().trim().min(1, 'Mother\'s name is required').optional(),
    motherOccupation: z.string().trim().min(1, 'Mother\'s occupation is required').optional(),
    motherContactNo: z.string().trim().min(1, 'Mother\'s contact number is required').optional(),
});

const updateLocalGuardianValidationSchema = z.object({
    name: z.string().trim().min(1, 'Local guardian\'s name is required').optional(),
    occupation: z.string().trim().min(1, 'Local guardian\'s occupation is required').optional(),
    contactNo: z.string().trim().min(1, 'Local guardian\'s contact number is required').optional(),
    address: z.string().trim().min(1, 'Local guardian\'s address is required').optional(),
});

export const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: updateUserNameValidationSchema,
            gender: z.enum(['male', 'female', 'others']).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().trim().email('Invalid email format').optional(),
            contactNo: z.string().trim().min(1, 'Contact number is required').optional(),
            emergencyContactNo: z.string().trim().min(1, 'Emergency contact number is required').optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            presentAddress: z.string().trim().min(1, 'Present address is required').optional(),
            permanentAddress: z.string().trim().min(1, 'Permanent address is required').optional(),
            guardian: updateGuardianValidationSchema,
            localGuardian: updateLocalGuardianValidationSchema,
            admissionSemester: z.string().optional(),
            profileImg: z.string().trim().optional(),
        })
    })
})

export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema
}