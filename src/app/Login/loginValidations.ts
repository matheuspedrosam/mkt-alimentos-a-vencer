import { collection, db, getDocs, query, where } from "../../firebase/config"

interface User {
    userType: string,
    email: string,
    password: string,
}

export default async function loginValidations(user: User){
    const { userType, email, password } = user;

    // Client and Retailer
    if(!email || !password) throw new Error('Os campos são obrigatórios.');
    
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