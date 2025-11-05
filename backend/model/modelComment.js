import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const getComments = async (db) => {
debugger
  const colletionRef = collection(db, "Comments");
  console.log(colletionRef);
  const q = await query(colletionRef);
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
