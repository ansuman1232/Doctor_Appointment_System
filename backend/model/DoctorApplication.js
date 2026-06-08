import mongoose from 'mongoose';

const DoctorApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  qualifications: { type: String }, // Link to PDF or text
  cost:{type:Number,required:true},
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

const DoctorApplication = mongoose.model('DoctorApplication', DoctorApplicationSchema);
export default DoctorApplication;