import { collection, getDocs, query, orderBy, addDoc, where } from "firebase/firestore";


export const listComments = async (request, reply) => {
  try {

    const db = request.server.firestore;
    if (!db) throw new Error("Firestore não inicializado corretamente!");

    const commentsRef = collection(db, "Comments");
    const q = query(commentsRef, orderBy("__name__", "asc"));
    const snapshot = await getDocs(q);

    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    reply.send(comments);
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    reply.status(500).send({ error: error.message });
  }
};


export const addNewComment = async (request, reply) => {
  try {
    const db = request.server.firestore;
    if (!db) {
      return reply.status(500).send({
        "messagem": "Erro ao Iniciar o Firebase"
      })
    }

    const { nome, nota, descricao } = request.body;
    const newComment = {
      "nome": nome,
      "nota": nota,
      "descricao": descricao
    }

    const existComment = [];
    const colletionRef = collection(db, "Comments");

    const q = await query(colletionRef, where("nome", "==", newComment.nome))
    const docSnapShot = await getDocs(q);
    docSnapShot.docs.map(doc => {
      existComment.push(doc.data())
    })

    if (existComment.length > 0) {
      return reply.status(409).send({
        "menssagem": `${existComment[0].nome} você já deixou seu comentário e agradeço muito pela sua colaboração!`
      })
    }
    const addNewComment = await addDoc(colletionRef, newComment);

    return reply.status(201).send({
      "message": "Adicionado com sucesso!",
      "id": addNewComment.id
    })

  } catch (error) {
    console.error("Erro ao adicionar um novo comentários:", error);
    reply.status(500).send({ error: error.message });
  }
}
