import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:{type: String},
    type:{type:String}
})

const Notification = mongoose.model('Notification',NotificationSchema);
export default Notification;