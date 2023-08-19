const mongoose = require('mongoose');

const EnrollmentSchema = mongoose.Schema({

    course:{type: mongoose.Schema.ObjectId, ref : 'Course'},
    updated :{type : Date},
    enrolled : { type: Date , default : Date.now},
    student : {type : mongoose.Schema.ObjectId, ref : 'User'},
    lessonStatus : [{lesson : {type :mongoose.Schema.ObjectId , ref : 'Lesson'} , complete : Boolean}],
    completed : Date

})

module.exports = mongoose.model('Enrollment',EnrollmentSchema)