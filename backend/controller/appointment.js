import Appointment from '../model/AppointmentSchema.js';
import User from '../model/UserSchema.js';

export const createAppointment = async (req, res) => {
  const {patientId, doctorId, date, slot, symptoms } = req.body;
  if(!patientId || !doctorId || !date || !slot || !symptoms)res.status(400).json({"message":"please enter date , slot and symptoms"})
  
 
  try {

        // 1. Normalize the incoming date string to strictly represent YYYY-MM-DD at Midnight UTC
    // This strips any local timezone hours, minutes, or seconds sent by the client
    const dateOnlyString = new Date(date).toISOString().split('T')[0]; 
    const normalizedDate = new Date(`${dateOnlyString}T00:00:00.000Z`);

        // 1. Check if the doctor is already booked for this specific date and slot
        const existingAppointment = await Appointment.findOne({
          doctorId,
          date:normalizedDate,
          slot 
        });
    
        if (existingAppointment) {
          return res.status(400).json({ 
            error: "This time slot has already been booked for this doctor." 
          });
        }


    // 1. Create the Appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      slot,
      symptoms,
      status: 'pending'
    });

    // 2. Link to Patient's User Profile (As per your Schema)
    await User.findByIdAndUpdate(patientId, {
      $push: { appointment: newAppointment._id }
    });

    // 3. Link to Doctor's User Profile
    await User.findByIdAndUpdate(doctorId, {
      $push: { appointment: newAppointment._id }
    });

    // 4. Notify Doctor (Real-time)
    const io = req.app.get('socketio');

    io.to(doctorId.toString()).emit("new_appointment_request", {
      message: "New appointment request received",
      appointmentId: newAppointment._id
    });

    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
