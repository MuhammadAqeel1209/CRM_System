import mongoose from 'mongoose';

const enrollDataSchema = new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses', 
        required: true,
      },
      enrollmentDate: {
        type: Date,
        default: Date.now,
      },
    })

const enrollData = mongoose.models.EnrollCourses|| mongoose.model('EnrollCourses', enrollDataSchema);
export default enrollData;
