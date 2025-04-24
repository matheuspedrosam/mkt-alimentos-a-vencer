import { GeoPoint } from "firebase/firestore";

interface User {
    userType: string,
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    cep?: string,
    state?: string,
    city?: string,
    neighborhood?: string,
    street?: string,
    number?: string,
    complement?: string,
    establishmentName?: string,
    addressGeocode?: GeoPoint
}

export default function registerValidations(user: User){
    const {userType, name, email, password, confirmPassword} = user;
    const {cep, state, city, neighborhood, street, number, complement, establishmentName} = user;

    // Client and Retailer
    if(!name || !email || !password || !confirmPassword) throw new Error('Todos os campos são obrigatórios.');
    
    if(name.length < 3) throw new Error('Nome inválido.');

    if(name.length > 150 || email.length > 150 || password.length > 150) throw new Error('Os campos não podem conter mais de 150 caracteres.');

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegexp.test(email)) throw new Error('Insira um e-mail válido.');

    if(password.length < 6) throw new Error('A senha deve haver pelo menos 6 caracteres.');

    if(password != confirmPassword) throw new Error('As senhas não coicidem.');

    // Retailer
    if(userType === 'RETAILER'){
        if(!state) throw new Error('Escolha um estado.');

        if(!cep || !city || !neighborhood || !number || !street) throw new Error('Preencha os campos obrigatórios.');

        const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
        if(!cepRegex.test(cep)) throw new Error('Formato correto de CEP: "12345-678".');

        if(number.length > 10) throw new Error('O Número não pode possuir mais de 10 caracteres.');

        if(city.length > 150 || street.length > 150 || neighborhood.length > 150 || complement.length > 150 || establishmentName.length > 150) throw new Error('Os campos não podem conter mais de 150 caracteres.');
    }

    return;
}