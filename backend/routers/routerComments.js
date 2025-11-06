import {listComments, addNewComment, sendEmail}  from "../controller/controllerCreateComment.js";

export default async function commentsRoutes(fastify) {
  fastify.get("/listComments", listComments);
  fastify.post("/addNewComment", addNewComment);
  fastify.post("/sendEmail", sendEmail);
}


