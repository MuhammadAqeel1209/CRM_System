const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  objectives: {
    type: [String], 
    required: true,
  },
  material: {
    type: [String], 
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  levels: {
    type: String,
    required : true,
  },
 price: {
    type: Number,
    required: true,
  }
});


const Course =  mongoose.models.Courses || mongoose.model('Courses', courseSchema);
module.exports = Course;
