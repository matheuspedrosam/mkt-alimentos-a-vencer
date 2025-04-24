import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

interface User {
    userType: string,
    email: string,
}

export default async function forgotPasswordValidations(user: User){
    const { userType, email } = user;

    // Client and Retailer
    if(!email) throw new Error('O campo é obrigatório.');
    
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegexp.test(email)) throw new Error('Insira um e-mail válido.');

    // Verify If Email Belongs to same userType
    const q = query(collection(db, "users"), where("userType", "==", userType), where("email", "==", email));
 
    let selectedUserType = userType == "CLIENT" ? "Cliente" : "Varejista"
    let opositeUserType = userType == "CLIENT" ? "Varejista" : "Cliente"

    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) throw new Error(`Não foi encontrado nenhum "${selectedUserType}" com esse email, tente selecionar "${opositeUserType}".`
    );

    return;
}