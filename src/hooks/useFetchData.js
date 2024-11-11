import { getDocs, collection, where, query, orderBy, updateDoc, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function useFetchData() {

    async function getData(collectionName){
        const dataCollection = collection(db, collectionName);
        const snapshot = await getDocs(dataCollection);
      
        const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docsList;
    }

    async function getDataByQuery(collectionName, field, operator, value) {
        const dataCollection = collection(db, collectionName);
        const q = query(dataCollection, where(field, operator, value));

        const snapshot = await getDocs(q);
        const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docsList;
    }

    async function getOrderedData(collectionName, orderField, orderDirection) {
        try {
            const dataCollection = collection(db, collectionName);    
            const q = query(dataCollection, orderBy(orderField, orderDirection));
    
            const snapshot = await getDocs(q);
            const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return docsList;
        } catch (error) {
            console.error("Erro ao obter os dados ordenados:", error);
            throw error;
        }
    }

    async function getQueryAndOrderedData(collectionName, field, operator, value, orderField, orderDirection = "asc") {
        try {
            const dataCollection = collection(db, collectionName);
            const q = query(
                dataCollection,
                where(field, operator, value),
                orderBy(orderField, orderDirection)
            );
    
            const snapshot = await getDocs(q);
            const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return docsList;
        } catch (error) {
            console.error("Erro ao obter os dados filtrados e ordenados:", error);
            throw error;
        }
    }

    async function setData(collectionName, data) {
        try {
            const dataCollection = collection(db, collectionName);
            const docRef = await addDoc(dataCollection, data);
            console.log("Documento adicionado com ID:", docRef.id);
            return docRef.id; 
        } catch (error) {
            console.error("Erro ao adicionar documento:", error);
            throw error; 
        }
    }

    async function updateData(collectionName, docId, newData) {
        try {
            const docRef = doc(db, collectionName, docId); 
            await updateDoc(docRef, newData); 
            console.log("Documento atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar documento:", error);
            throw error;
        }
    }

    async function deleteData(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId); 
            await deleteDoc(docRef); 
            console.log("Documento deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar documento:", error);
            throw error;
        }
    }

    return { getData, getDataByQuery, getOrderedData, getQueryAndOrderedData, setData, updateData, deleteData }
}
