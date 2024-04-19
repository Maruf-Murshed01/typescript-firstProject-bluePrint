import { Schema, model, Types } from 'mongoose';
// import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  StudentModel,
  TUserName,
} from './student.interface';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstname: {
    type: String,
    required: [true, 'First Name is required'],
    maxlength: [20, 'Name max length can not be more than 20 characters'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize format',
    // }
  },
  middlename: {
    type: String,
  },
  lastname: {
    type: String,
    required: [true, 'Last Name is required'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not valid'
    // }
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father\'s Name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father\'s Occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father\'s Contact Number is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother\'s Name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother\'s Occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother\'s Contact Number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian\'s Name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian\'s Occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian\'s Contact Number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian\'s Address is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: true, unique: true },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'Student\'s user id is required'],
    ref: "User"
  },
  // password: { type: String, required: [true, 'password is required'], maxlength: [20, 'passwrod cant not be more than 20 characters'] },
  name: {
    type: userNameSchema,
    required: [true, 'Student\'s Name is required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'others'],
      message: 'This gender field can only be male, female, or others'
    },
    required: [true, 'Gender is required'],
  },
  dateOfBirth: { type: Date },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // validate: {
    //   validator: (value: string) => validator.isEmail(value),
    //   message: '{VALUE} is not a valid type of email'
    // }
  },
  contactNo: { type: String, required: [true, 'Contact Number is required'] },
  emergencyContactNo: { type: String, required: [true, 'Emergency Contact Number is required'] },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood Group is required']
  },
  presentAddress: { type: String, required: [true, 'Present Address is required'] },
  permanentAddress: { type: String, required: [true, 'Permanent Address is required'] },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian Information is required']
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian Information is required']
  },
  profileImg: { type: String },
  admissionSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester'
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment'
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
},
  {
    toJSON: {
      virtuals: true
    }
  });


// virtuals
studentSchema.virtual('fullname').get(function () {
  return `${this?.name?.firstname}  ${this?.name?.middlename}  ${this?.name?.lastname}`;
})





//Query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

//creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id: id })

  return existingUser;
}


//creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id: id })

//   return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
