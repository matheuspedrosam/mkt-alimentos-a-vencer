import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { mainStyles } from '../../utils/mainStyles';
import { Picker } from '@react-native-picker/picker';
import { states } from '../../db/mockedDb';
import { Modalize } from 'react-native-modalize';
import { Icon } from '@rneui/base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChangeUserType } from '../../components/ChangeUserType';
import { router } from 'expo-router';
import registerValidations from './registerValidations';
import { auth, db } from '../../firebase/config';
import useUserStore from '../../store/user';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { doc, GeoPoint, setDoc } from 'firebase/firestore';
import { API_KEY } from "@env";

export interface RegisterScreenProps {
}

export default function RegisterScreen (props: RegisterScreenProps) {
    const { user, setUser } = useUserStore.getState();

    const [userType, setUserType] = useState('CLIENT');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cep, setCep] = useState('');
    const [cepLoading, setCepLoading] = useState(false);
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [establishmentName, setEstablishmentName] = useState('');

    const [selectedState, setSelectedState] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const modalRef = useRef<Modalize>(null);
            
    function openModal(e: any){
        if(Platform.OS === 'ios'){
            modalRef.current?.open();
        }
    };

    function cleandFields(){
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCep('');
        setCity('');
        setStreet('');
        setNumber('');
        setComplement('');
        setEstablishmentName('');
    }

    async function handleCallViaCepAPI(){
        if(!cep) return;

        const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
        if(!cepRegex.test(cep)) {
            setError("CEP inválido, formato esperado: xxxxx-xxx");
            setNeighborhood(null);
            setStreet(null);
            setSelectedState(null);
            setCity(null);
            return;
        } else{
            setError(null);
            setCepLoading(true);
            try{
                const res = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json`)
                const data = await res.json();
                setNeighborhood(data.bairro);
                setStreet(data.logradouro);
                setSelectedState(data.uf);
                setCity(data.localidade);
            } catch(e){
                console.log(e);
            } finally{
                setCepLoading(false);
            }
        }

    }
    
    async function handleSubmitForm(e: any){
        e.preventDefault();
        setLoading(true);

        const user = { 
            userType, 
            name, 
            email, 
            password, 
            confirmPassword,
            cep, 
            state: selectedState,
            city,
            neighborhood,
            street, 
            number, 
            complement, 
            establishmentName,
            addressGeocode: null
        }

        if(userType == 'CLIENT'){
            delete user.cep; delete user.state; delete user.city;
            delete user.street; delete user.number; delete user.complement; delete user.establishmentName;
            delete user.neighborhood; delete user.addressGeocode;
        }

        try{
            registerValidations(user); // Validations

            if(userType === "RETAILER"){
                const address = `${user.street}, ${user.number}, ${user.neighborhood}, ${user.city}, ${user.state}, ${user.cep}`;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`; 
                const res = await fetch(url);
                const geocode = await res.json();
                const geometryLocation = geocode.results[0].geometry.location;
                const { lat, lng } = geometryLocation;
                user.addressGeocode = new GeoPoint(lat, lng);
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    delete user.password; delete user.confirmPassword;

                    const userDocRef = doc(db, "users", userCredential.user.uid);
                    
                    await setDoc(userDocRef, {...user, createdAt: Date.now()});
                    setLoading(false);
                    setError('');
                    cleandFields();
                    Alert.alert("Sucesso", "Usuário criado com sucesso!");
                    setUser({id: userCredential.user.uid, ...user});
                    if(userType == 'CLIENT'){
                        router.replace("Home/Client/ClientHomeScreen");
                    } else if(userType == 'RETAILER'){
                        router.replace("Home/Retailer/RetailerHomeScreen");
                    }
                })
                .catch((error) => {
                    let errorMessage = error.message;
                    if(error.message.includes('auth/email')){
                        errorMessage = "Esse E-mail já esta em uso."
                    }
                    setError(errorMessage);
                    setLoading(false);
                });
        }catch(e){
            setError(e.message);
            setLoading(false);
        }
    }
            
    return (
        <GestureHandlerRootView>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={styles.logo}/>
                    <Text style={styles.h1}>CADASTRO</Text>

                    {/* ChangeUserBtns */}
                    <ChangeUserType userType={userType} setUserType={setUserType}/>

                    {/* Form (Client) */}
                    {userType == 'CLIENT' &&
                        <View style={[styles.form, error && {marginBottom: 50}]}>
                            <TextInput
                                style={styles.input}
                                placeholder='NOME COMPLETO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setName(text)}
                                value={name}/>
                            <TextInput
                                style={styles.input}
                                placeholder='E-MAIL'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setEmail(text)}
                                value={email}/>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input}
                                placeholder='SENHA'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setPassword(text)}
                                value={password}/>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input}
                                placeholder='CONFIRMAR SENHA'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setConfirmPassword(text)}
                                value={confirmPassword}/>
                        </View>
                    }

                    {/* Form (Retailer) */}
                    {userType == 'RETAILER' &&
                        <View style={[styles.form, userType === 'RETAILER' && {marginBottom: 40}]}>
                            <TextInput
                                style={styles.input}
                                placeholder='NOME COMPLETO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setName(text)}
                                value={name}/>
                            <TextInput
                                style={styles.input}
                                placeholder='E-MAIL'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setEmail(text)}
                                value={email}/>
                            <View style={styles.inputGridContainer}>
                                <TextInput
                                    style={[styles.input, styles.inputGrid]}
                                    placeholder='CEP'
                                    placeholderTextColor={mainStyles.mainColors.primaryColor}
                                    onChangeText={(text) => setCep(text)}
                                    onEndEditing={handleCallViaCepAPI}
                                    value={cep}/>
                                <View style={[styles.picker, styles.inputGrid]} onTouchEnd={openModal}>
                                    {Platform.OS === 'android' &&
                                        <Picker
                                            selectedValue={selectedState}
                                            onValueChange={(itemValue) => setSelectedState(itemValue)}
                                        >
                                            <Picker.Item label="Estado" value="" />
                                            {states.map((state) => (
                                                <Picker.Item key={state.value} label={state.label} value={state.value} />
                                            ))}
                                        </Picker>
                                    }
                                    {Platform.OS === 'ios' &&
                                        <View
                                            style={{height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <Text>{selectedState || 'Estado'}</Text>
                                            <Icon name='arrow-drop-down'/>
                                        </View>
                                    }
                                </View>
                            </View>
                            <View style={styles.inputGridContainer}>
                                <TextInput
                                    style={[styles.input, styles.inputGrid]}
                                    placeholder='CIDADE'
                                    placeholderTextColor={mainStyles.mainColors.primaryColor}
                                    onChangeText={(text) => setCity(text)}
                                    value={cepLoading ? 'Aguarde...' : city}/>
                                <TextInput
                                    style={[styles.input, styles.inputGrid]}
                                    placeholder='NÚMERO'
                                    placeholderTextColor={mainStyles.mainColors.primaryColor}
                                    onChangeText={(text) => setNumber(text)}
                                    value={number}/>
                            </View>
                            <TextInput 
                                style={[styles.input, styles.inputGrid]}
                                placeholder='BAIRRO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setNeighborhood(text)}
                                value={cepLoading ? 'Aguarde...' : neighborhood}/>
                            <TextInput
                                style={styles.input}
                                placeholder='RUA'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setStreet(text)}
                                value={cepLoading ? 'Aguarde...' : street}/>
                            <TextInput
                                style={styles.input}
                                placeholder='COMPLEMENTO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setComplement(text)}
                                value={complement}/>
                            <TextInput
                                style={styles.input}
                                placeholder='NOME DO ESTABELECIMENTO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setEstablishmentName(text)}
                                value={establishmentName}/>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input}
                                placeholder='SENHA'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setPassword(text)}
                                value={password}/>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input}
                                placeholder='CONFIRMAR SENHA'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setConfirmPassword(text)}
                                value={confirmPassword}/>
                        </View>
                    }

                    {/* Error Messages */}
                    {error && <Text style={styles.errorMessage}>Erro: {error}</Text>}

                    {/* SubmitForm (Outside Form) */}
                    {!loading && 
                        <TouchableOpacity
                            onPressIn={handleSubmitForm}
                            style={styles.submitFormButton}>
                                <Text style={styles.buttonsText}>CADASTRAR</Text>
                        </TouchableOpacity>
                    }
                    {loading && 
                        <View
                            style={[styles.submitFormButton, {backgroundColor: 'gray'}]}>
                                <Text style={styles.buttonsText}>CADASTRAR</Text>
                        </View>
                    }

                    {/* Already have an account? */}
                    <View style={styles.alreadyHaveAccount}>
                        <Text style={{fontWeight: '500', fontSize: 16}}>Já tem cadastro?</Text>
                        <TouchableOpacity onPressIn={() => router.replace("Login/LoginScreen")}>
                                <Text style={styles.loginLink}>Faça Login!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modal */}
            <Modalize 
                ref={modalRef} 
                snapPoint={200}
                modalHeight={200}>
                    <Picker
                        style={{height: 200}}
                        selectedValue={selectedState}
                        onValueChange={(itemValue) => setSelectedState(itemValue)}
                    >
                        <Picker.Item label="Estado" value="" />
                        {states.map((state) => (
                            <Picker.Item key={state.value} label={state.label} value={state.value} />
                        ))}
                </Picker>
            </Modalize>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 30,
        marginVertical: 20
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 40
    },
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        borderBottomColor: mainStyles.mainColors.primaryColor,
        borderBottomWidth: 2,
        marginBottom: 40
    },
    buttonsText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },

    // Form
    form: {
        width: '100%',
        marginBottom: 100
    },
    input: {
        backgroundColor: mainStyles.mainColors.transparentColor,
        padding: 15,
        borderRadius: 5,
        borderColor: mainStyles.mainColors.primaryColor,
        borderWidth: 1,
        textDecorationColor: mainStyles.mainColors.primaryColor,
        marginBottom: 10
    },
    inputGridContainer: {
        flexDirection: 'row',
        gap: 10
    },
    inputGrid: {
        flex: 1
    },
    picker: {
        backgroundColor: mainStyles.mainColors.transparentColor,
        borderRadius: 5,
        borderColor: mainStyles.mainColors.primaryColor,
        borderWidth: 1,
        textDecorationColor: mainStyles.mainColors.primaryColor,
        marginBottom: 10,
        paddingVertical: 0,
        paddingHorizontal: 15
    },
    errorMessage:{
        color: mainStyles.mainColors.primaryColor,
        marginBottom: 50,
    },
    submitFormButton:{
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginBottom: 20
    },

    // alreadyHaveAccount
    alreadyHaveAccount:{
        flexDirection: 'row',
        gap: 5,
    }, 
    loginLink: {
        color: mainStyles.mainColors.primaryColor,
        fontSize: 16,
        textDecorationLine: 'underline',
        fontWeight: '500'
    },
});
