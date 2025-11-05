// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import commentsRoutes from "./routers/routerComments.js";
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
fastify.register(fastifyCors, {
  origin: "*" 
});
fastify.decorate("firestore", db);
fastify.register(commentsRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
    console.log("🔥 Server running at http://localhost:3333");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
