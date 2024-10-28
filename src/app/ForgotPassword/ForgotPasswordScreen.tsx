import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Logo } from '../../components/Logo';
import { mainStyles } from '../../utils/mainStyles';
import { useState } from 'react';
import { Icon } from '@rneui/base';
import { ChangeUserType } from '../../components/ChangeUserType';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import forgotPasswordValidations from './forgotPasswordValidations';
import { auth, sendPasswordResetEmail } from '../../firebase/config';

export interface ForgotPasswordScreenProps {
}

export default function ForgotPasswordScreen (props: ForgotPasswordScreenProps) {
    const [userType, setUserType] = useState('CLIENT');
    const [email, setEmail] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    function cleandFields(){
        setEmail('');
    }

    function sendLinkChange(auth: any, email: any){

    }

    async function handleSubmitForm(e: any){
        e.preventDefault();

        setLoading(true);

        const user = { 
            userType, 
            email,
        }

        try{
            await forgotPasswordValidations(user); // Validations

            sendPasswordResetEmail(auth, email)
                .then(async () => {
                    setLoading(false);
                    setError('');
                    cleandFields();
                    Alert.alert("Sucesso", "E-mail enviado com sucesso!");
                    router.replace("Login/LoginScreen");
                })
                .catch((error) => {
                    let errorMessage = error.message;
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
                    {/* Logo */}
                    <View style={{marginBottom: 40}}>
                        <Logo logoHeight={100} logoWidth={100} titleFontSize={22} subTitleFontSize={12} circleSize={8}/>
                    </View>

                    {/* Title */}
                    <Text style={styles.h1}>SENHA ESQUECIDA</Text>

                    {/* ChangeUserBtns */}
                    <ChangeUserType userType={userType} setUserType={setUserType}/>

                    <Text style={{fontWeight: 'bold'}}>Digite seu e-mail que enviaremos um link</Text>
                    <Text style={{marginBottom: 40, fontWeight: 'bold'}}>para redefinir a senha</Text>

                    {/* SendPasswordForm */}
                    <View style={[styles.form, error && {marginBottom: 50}]}>
                        <View style={styles.inputsContainer}>
                            <Icon name='email' color={mainStyles.mainColors.primaryColor}/>
                            <TextInput 
                                style={styles.input} 
                                placeholder='E-mail'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                onChangeText={(text) => setEmail(text)}
                                value={email}/>
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

                    {/* CancelButton */}
                    <TouchableOpacity onPressIn={() => router.replace('Login/LoginScreen')}
                        style={styles.cancelButton}>
                            <Text style={[styles.buttonsText, {color: mainStyles.mainColors.primaryColor}]}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
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

    // cancelButton
    cancelButton: {
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
