import express, { urlencoded } from 'express'
import mongoose from 'mongoose';
import router from './routes/route.js';
import http from 'http';
import cors  from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io'; 
const app = express()



// Adds headers: Access-Control-Allow-Origin: *
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//app.use("/api/v1/",router);



const main =async ()=>{
mongoose.connect(`${process.env.MONGO_URL}`)
 
}


main().then(() => {
  console.log('Connected to MongoDB!');

  const server = http.createServer(app);

  // 2. Initialize Socket.io and attach it to your HTTP server
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to match your frontend URL in production
      methods: ["GET", "POST","PATCH","PUT"]
    }
  });

  // 3. CRITICAL: Store the io instance in Express so my controllers can reach it
  app.set('socketio', io);

  // 4. Register your routes AFTER setting 'socketio'
  app.use("/api/v1/", router);

  // 5. Socket connection listener (Useful for rooms setup)
  io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Expect the client to send their userId to join their private room
    socket.on('join_room', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`👥 User ${userId} joined room`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // 6. Start the server
  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch(err => {
  console.error("Database connection failed:", err);
});