import User from "../model/UserSchema.js";

let getAllDoctors= async (req,res)=>{
   let data=await User.find();
   
    res.json({data});
}

export {getAllDoctors}