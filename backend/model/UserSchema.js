
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  contact_no:{type:Number},
  cost:{type:Number},
  appointment:[{type:mongoose.Schema.Types.ObjectId, ref: 'Appointment'}],
  specialization: { type: String }, // For doctors only
  availability: [{ day: String, slots: [String] }] // For doctors only
  
});



const User = mongoose.model('User', UserSchema);

export default User;