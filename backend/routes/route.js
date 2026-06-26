
import express from 'express'
import {addAdmin, login,register,refresh,logout} from "../controller/user.js";
import {getAllDoctors} from "../controller/info.js"
import { handleDoctorApplication,getAllDoctorApplication ,createDoctorApplication } from '../controller/doctorApplication.js';
import {createAppointment,getMyAppointments, getPendingAppointment, handelPatientAppointment} from '../controller/appointment.js'
import {chatBot} from "../controller/chatbot.js"
import {getUserNotifications,markNotificationsAsRead} from '../controller/notification.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World')
})


//==========for user======================
router.post("/addAdmin", addAdmin)

router.post("/register", register)

router.get("/get_doctor",getAllDoctors)

router.post("/login",login)
router.post("/logout",logout)

router.post('/refresh-token',refresh)

router.post('/create_appointment',createAppointment)
router.post('/chatbot',chatBot)
router.post('/create-doctor-application',createDoctorApplication)
router.get('/my-appointment/:id',getMyAppointments)
//==============for admin===============================
router.get('/admin/doctor-applications',getAllDoctorApplication)
router.put('/admin/doctor_applications/:applicationId',handleDoctorApplication)
//==========for notificaion==============
router.get('/notifications/:userId',getUserNotifications)
router.post('/notifications/mark-read',markNotificationsAsRead)
//==============for doctor===============
router.get('/get-all-pending-appointment/:id',getPendingAppointment)
router.post('/pending-appointment',handelPatientAppointment)
export default router;