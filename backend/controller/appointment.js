import Appointment from '../model/AppointmentSchema.js';
import User from '../model/UserSchema.js';

export const createAppointment = async (req, res) => {
  const {patientId, doctorId, date, slot, symptoms } = req.body;

  
 
  try {
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
