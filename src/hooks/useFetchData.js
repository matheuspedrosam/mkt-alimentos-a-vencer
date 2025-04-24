import { getDocs, collection, where, query, orderBy, updateDoc, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { db, storage } from '../firebase/config'
import calculateDistance from '../utils/calculeDistance';
import { deleteObject, ref } from 'firebase/storage';

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

    async function getDataByRadius(collectionName, center, radiusInKm) {
        try {
            const dataCollection = collection(db, collectionName);
            const snapshot = await getDocs(dataCollection);

            const filteredResults = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((doc) => {
                    if (doc.addressGeoCode) {
                        const { latitude, longitude } = doc.addressGeoCode;
                        const distance = calculateDistance(
                            center.latitude,
                            center.longitude,
                            latitude,
                            longitude
                        );
                        return distance <= radiusInKm;
                    }
                    return false;
                });
            return filteredResults;
        } catch (err) {
            setError(err.message);
            console.error("Erro ao buscar dados geoespaciais:", err);
            return [];
        }
    }

    function filterDataByRadius(data, center, radiusInKm){
        const filteredResults = data.filter((doc) => {
            if (doc.addressGeocode) {
                const { latitude, longitude } = doc.addressGeocode;
                const distance = calculateDistance(
                    center.latitude,
                    center.longitude,
                    latitude,
                    longitude
                );
                return distance <= radiusInKm;
            }
            return false;
        });
        return filteredResults;
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
            if (!collectionName) {
                return;
            }
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

    function extractFilePathFromURL(downloadURL) {
        // Extraia o caminho do arquivo entre "/o/" e "?"
        const regex = /\/o\/(.*?)\?/;
        const match = downloadURL.match(regex);
      
        if (match && match[1]) {
          // Decodifica o caminho URL-encoded
          return decodeURIComponent(match[1]);
        }
      
        throw new Error("Caminho do arquivo não encontrado na URL");
    }

    async function deleteImageByDownloadURL(downloadURL) {
        try {
            const filePath = extractFilePathFromURL(downloadURL);
            const fileRef = ref(storage, filePath);
        
            await deleteObject(fileRef);
            console.log("Imagem deletada com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar a imagem:", error);
            if (error.code === 'storage/object-not-found') {
                console.log('O arquivo não foi encontrado.');
            }
        }
    }

    return { getData, getDataByQuery, getDataByRadius, filterDataByRadius, getOrderedData, getQueryAndOrderedData, setData, updateData, deleteData, deleteImageByDownloadURL }
}
