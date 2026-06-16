import DoctorApplication from '../model/DoctorApplication.js';
import User from '../model/UserSchema.js';
import Notification from '../model/Notification.js'; 
import mongoose from 'mongoose';

export const createDoctorApplication =async (req,res)=>{
  const {userId,spec,exp,cost,quali}=req.body;
 // console.log(userId);
   try{
     //console.log(userId,spec,exp,cost,quali)
    if(!userId || !spec || !exp || !cost )res.status(400).json({"error":"please enter specialization ,experience and fee "})
  const doc=  new DoctorApplication({userId,experience:exp,qualifications:quali,specialization:spec,cost})
   await doc.save();
   res.json({"message":"Your application was successfully sent"})
   }
   catch(e){
    console.log(e);
   }
}


export const handleDoctorApplication = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
 console.log(applicationId)
  const io = req.app.get('socketio');
  let user=null;
  const session = await mongoose.startSession();
  session.startTransaction();
  let application=null;
  try {
    // 1. Update Application Status
     application = await DoctorApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { returnDocument: 'after', session }
    );

    if (!application) throw new Error("Application not found");

    // 2. IF APPROVED: Upgrade the User's Role

    if (status === 'approved') {
     user= await User.findByIdAndUpdate(
        application.userId,
        { 
          role: 'doctor',
          specialization: application.specialization 
        },
        { session }
      );

      
    }

    // 3. Create Persistent Notification
    await Notification.create([{
      userId: application.userId,
      message: `Your application to become a doctor was ${status}.`,
      type: 'SYSTEM_ALERT'
    }], { session });


     
    // Commit Transaction
    await session.commitTransaction();
  
  await  session.endSession(); // End session safely here since DB work is complete

    // Send successful HTTP response back to client immediately

    res.json({ success: true, status });

  } catch (error) {
    await session.abortTransaction();
   await session.endSession();
   return res.status(500).json({ error: error.message });
  } 

   // 4. Real-Time Socket Trigger
   if (io && application && application.userId) {

    try {
   io.to(application.userId.toString()).emit("admin_decision", {
    status,
    message: `Application ${status}`
  });
   // Broadcast the freshly updated doctor object to all connected dashboard users
   io.emit("doctor_list_updated", user);
}catch (socketError) {
  // Log socket errors separately so they don't break your API response
  console.error("Socket emission failed:", socketError.message);
}
}
else {
  console.warn("Socket.io (io) object or userId was missing; skipping real-time notification.");
}




};


export const getAllDoctorApplication= async (req,res)=>{
    try{
      const arr= await DoctorApplication.find();
       res.json({arr})
    }catch(e){
      console.log(e);
         }
}

