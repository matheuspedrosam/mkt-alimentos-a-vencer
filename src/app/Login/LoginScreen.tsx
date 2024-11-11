import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Logo } from '../../components/Logo';
import { mainStyles } from '../../utils/mainStyles';
import { useState } from 'react';
import { Icon } from '@rneui/base';
import { ChangeUserType } from '../../components/ChangeUserType';
import { router } from 'expo-router';
import loginValidations from './loginValidations';
import { auth } from '../../firebase/config';
import useUserStore from '../../store/user';
import { signInWithEmailAndPassword } from '@firebase/auth';

export interface LoginScreenProps {
}

export default function LoginScreen (props: LoginScreenProps) {
    const { user, setUser } = useUserStore.getState();

    const [userType, setUserType] = useState('CLIENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    function cleandFields(){
        setEmail('');
        setPassword('');
    }

    async function handleSubmitForm(e: any){
        e.preventDefault();
        setLoading(true);

        const user = { 
            userType, 
            email, 
            password
        }

        try{
            await loginValidations(user); // Validations

            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    setLoading(false);
                    setError('');
                    cleandFields();
                    delete user.password;
                    Alert.alert("Sucesso", "Usuário logado com sucesso!");
                    setUser({id: userCredential.user.uid, ...user});
                    if(userType == 'CLIENT'){
                        router.replace("Home/Client/ClientHomeScreen");
                    } else if(userType == 'RETAILER'){
                        router.replace("Home/Retailer/RetailerHomeScreen");
                    }
                })
                .catch((error) => {
                    let errorMessage = error.message;
                    if(errorMessage.includes("auth/invalid")){
                        errorMessage = "Credenciais de acesso inválidas."
                    }
                    setError(errorMessage);
                    setLoading(false);
                });
        } catch(e){
            setError(e.message);
            setLoading(false);
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* Logo */}
                <View style={{marginBottom: 40}}>
                    <Logo logoHeight={100} logoWidth={100} titleFontSize={22} subTitleFontSize={12} circleSize={8}/>
                </View>

                {/* Title */}
                <Text style={styles.h1}>LOGIN</Text>

                {/* ChangeUserBtns */}
                <ChangeUserType userType={userType} setUserType={setUserType}/>

                {/* LoginForm */}
                <View style={[styles.form, error && {marginBottom: 50}]}>
                    <View style={styles.inputsContainer}>
                        <Icon name='email' color={mainStyles.mainColors.primaryColor}/>
                        <TextInput
                            textContentType='emailAddress'
                            style={styles.input} 
                            placeholder='E-mail'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setEmail(text)}
                            value={email}/>
                    </View>
                    <View style={styles.inputsContainer}>
                        <Icon name='lock' color={mainStyles.mainColors.primaryColor}/>
                        <TextInput
                            textContentType='password'
                            secureTextEntry
                            style={styles.input}
                            placeholder='Senha'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setPassword(text)}
                            value={password}/>
                    </View>

                    {/* Forgot Password? */}
                    <View style={styles.forgotPassword}>
                        <Text style={{fontWeight: '500', fontSize: 16}}>Esqueceu a senha?</Text>
                        <TouchableOpacity onPressIn={() => router.replace("/ForgotPassword/ForgotPasswordScreen")}>
                                <Text style={styles.forgotPasswordLink}>Clique aqui!</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Error Messages */}
                {error && <Text style={styles.errorMessage}>Erro: {error}</Text>}

                {/* SubmitForm (Outside Form) */}
                {!loading && 
                    <TouchableOpacity
                        onPressIn={handleSubmitForm}
                        style={styles.submitFormButton}>
                            <Text style={styles.buttonsText}>ENTRAR</Text>
                    </TouchableOpacity>
                }
                {loading && 
                    <View
                        style={[styles.submitFormButton, {backgroundColor: 'gray'}]}>
                            <Text style={styles.buttonsText}>ENTRAR</Text>
                    </View>
                }

                {/* RegisterButton */}
                <TouchableOpacity onPressIn={() => router.replace('Register/RegisterScreen')}
                    style={styles.registerButton}>
                        <Text style={[styles.buttonsText, {color: mainStyles.mainColors.primaryColor}]}>CADASTRE-SE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 30,
        marginVertical: 20
    },

    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        borderBottomColor: mainStyles.mainColors.primaryColor,
        borderBottomWidth: 2,
        marginBottom: 40
    },

    // changeUserButtonsContainer
    changeUserButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40
    },
    changeUserButtons:{
        backgroundColor: mainStyles.mainColors.transparentColor,
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    changeUserButtonsSelected:{
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 10,
        borderRadius: 5,
        flex: 1,
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

    inputsContainer: {
        borderBottomWidth: 1,
        borderBottomColor: mainStyles.mainColors.primaryColor,
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    },
    input: {
        width: '100%',
        padding: 15,
    },
    errorMessage:{
        color: mainStyles.mainColors.primaryColor,
        marginBottom: 50,
    },

    // SubmitFormBtn
    submitFormButton:{
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginBottom: 10
    },

    // registerButton
    registerButton: {
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: mainStyles.mainColors.primaryColor
    },

    // ForgotPassword
    forgotPassword:{
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'flex-end',
        marginTop: 10
    }, 
    forgotPasswordLink: {
        color: mainStyles.mainColors.primaryColor,
        fontSize: 16,
        textDecorationLine: 'underline',
        fontWeight: '500'
    },
});
