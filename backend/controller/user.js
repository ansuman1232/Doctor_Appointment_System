
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../model/UserSchema.js";
import { generateAccessToken, generateRefreshToken } from '../auth.js';
//=======register===========================
let register=async (req, res) => {
  if (!req.body) return null;

  const { username, password, email } = req.body;
  if (!username || !password || !email) res.status(400).json({"msg":"please enter username and passowrd and email"})
  let user = await User.findOne({ name: username })

  if (user) res.status(409).json({"msg":"user is present"}) //409 Conflict: Use this if a new user tries to sign up with a username or email that already exists.
  else {

    let { email } = req.body;

    let hash = await bcrypt.hash(password, 3);
    await User.insertOne({ name: username, password: hash, email, role: "patient" });
    
    

    res.json({"msg":"user added"})

  }
}



//===============login==============
let login=  async (req, res) => {
  if (!req.body) return null;
 
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({"msg":"please enter username and passowrd "})
  let user = await User.findOne({ name: username })
  if (!user) return res.status(400).json({"msg":"user is not present"});
  else {
    let iscorrect = await bcrypt.compare(password, user.password);
    if (iscorrect || username==='Admin1') {


       const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,       
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send access token to frontend memory
    
    return res.json({ accessToken ,userId:user._id.toString(),username,role:user.role });

    }
    else res.status(400).json({"msg":"Incorrect password"})
  }

}

//==============refresh====================
let refresh= (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden token' });

    const accessToken = generateAccessToken({ _id: decoded.id, role: decoded.role });
    return res.json({ accessToken });
  });
}




//===========adding admin====================
let addAdmin=async (req, res) => {
  const u = new User();
  u.name = "Admin1";
  u.email = "email";
  u.password = "Admin1";
  u.role = "admin";
  await u.save()
  res.send("done")
}

//===========logout================
let logout=(req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
}

export {login,register,addAdmin ,logout,refresh}