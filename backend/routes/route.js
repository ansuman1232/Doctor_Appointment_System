
import express from 'express'
import {addAdmin, login,register,refresh} from "../controller/user.js";
import {getAllDoctors} from "../controller/info.js"
import { handleDoctorApplication } from '../controller/doctorApplication.js';
import {createAppointment} from '../controller/appointment.js'
import {chatBot} from "../controller/chatbot.js"

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.post("/addAdmin", addAdmin)

router.post("/register", register)

router.get("/get_doctor",getAllDoctors)

router.post("/login",login)


router.post('/refresh-token',refresh)
router.post('/doctor_application/:applicationId',handleDoctorApplication)
router.post('/create_appointment',createAppointment)
router.post('/chatbot',chatBot)
export default router;