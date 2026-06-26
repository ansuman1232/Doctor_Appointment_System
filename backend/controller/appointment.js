import Appointment from '../model/AppointmentSchema.js';
import User from '../model/UserSchema.js';
import Notification from '../model/Notification.js';
import { UploadToFileSearchStoreOperation } from '@google/genai';

export const createAppointment = async (req, res) => {
  const {patientId, doctorId, date, slot, symptoms } = req.body;
  if(!patientId || !doctorId || !date || !slot || !symptoms)return res.status(400).json({"message":"please enter date , slot and symptoms"})
  
 
  try {

        // 1. Normalize the incoming date string to strictly represent YYYY-MM-DD at Midnight UTC
    // This strips any local timezone hours, minutes, or seconds sent by the client
    const dateOnlyString = new Date(date).toISOString().split('T')[0]; 
    const normalizedDate = new Date(`${dateOnlyString}T00:00:00.000Z`);
    
        // 1. Check if the doctor is already booked for this specific date and slot
        const existingAppointment = await Appointment.findOne({
          doctorId,
          date:normalizedDate,
          slot,
          status: { $in: [ 'pending', 'confirmed'] }
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
      date:normalizedDate,
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

    //======creating notification document==============
    await Notification.create([{
      userId: doctorId,
      message: `New appointment request received from userId: ${patientId}`,
      type: 'SYSTEM_ALERT',
      isRead:false
    }]);

    // 4. Notify Doctor (Real-time)
    const io = req.app.get('socketio');

    io.to(doctorId.toString()).emit("new_appointment_request", {
      message: "New appointment request received",
      appointmentId: newAppointment._id
    });

    res.status(201).json({"message":"your appointment request is sent to the doctor"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ "error": "Internal server error" });
  }
};



export const  handelPatientAppointment= async (req,res)=>{
    let {appId,status,patientId,symptoms}=req.body
    console.log(req.body)
    const io = req.app.get('socketio');

    let appointment=null;
   try{
    if(status==='confirmed'){
     
    appointment=  await Appointment.findOneAndUpdate({_id:appId},{$set: {
        status: 'confirmed'
      }})
      

    }
    else{
      appointment=  await Appointment.findOneAndUpdate({_id:appId},{$set: {
        status: 'cancelled'
      }})
    }

   await Notification.create([{
      userId: patientId,
      message: `your New appointment request ${status} by doctor for symptoms: ${symptoms}`,
      type: 'SYSTEM_ALERT',
      isRead:false
    }]);

    io.to(patientId.toString()).emit("doctor_response",{
      message:`your New appointment request ${status} by doctor for symptoms: ${symptoms}`
    })

 if(appointment){console.log("hello",appointment.doctorId.toString());   io.to(appointment.doctorId.toString()).emit("pending_patient_appointment_update",appId)}

    res.status(200).json({"message":"Appointment status changed successfully"});
  }
  catch(e){
    console.log(e);
    res.status(500).json({ "error": "Internal server error" });
  }
   

}



export const getPendingAppointment=async (req,res)=>{
  let {id}=req.params;

  try{
    let appointments= await Appointment.find({ doctorId:id ,status:"pending"})
    
    res.json({appointments})
  }
  catch(e){
    console.log(e);
    res.status(500).json({"error":"Internal server error"})
  }
}


export const getMyAppointments=async (req,res)=>{
  let {id}=req.params;
  try{
  let appointments=await Appointment.find({patientId:id});
//  console.log(appointments)
  res.json({appointments})
  }
  catch(e){
   console.log(e)
  }
  
}