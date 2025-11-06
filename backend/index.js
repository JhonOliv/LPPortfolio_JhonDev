// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import commentsRoutes from "./routers/routerComments.js";
import fastifyMailer from "fastify-mailer";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);



export { db, firebaseApp };

const fastify = Fastify();
fastify.decorate("firestore", db);
fastify.register(fastifyCors, {
  origin: "*" 
});
fastify.register(commentsRoutes);
fastify.register(fastifyMailer, {
  defaults: { from: process.env.MAIL_USER },
  transport: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
;
    console.log(`🔥 Server running at Port: ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
