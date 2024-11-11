import { Fragment, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { Icon } from '@rneui/base';
import useUserStore from '../../store/user';
import { mainStyles } from '../../utils/mainStyles';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import useFetchData from '../../hooks/useFetchData';

export interface EditProfileScreenProps {
}

export default function EditProfileScreen (props: EditProfileScreenProps) {
    const { height } = useWindowDimensions();
    const { user, setUser } = useUserStore.getState();
    const { setData } = useFetchData();

    const [ name, setName ] = useState(user.name);
    const [ blobImage, setBlobImage ] = useState(null);

    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);

    async function handlePickProfilePhoto(){
        setLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,  
            quality: 0.8,
        });
            
        if (!result.canceled) {
            const arquivo = await fetch(result.assets[0].uri);
            const arquivoBlob = await arquivo.blob();
            await handleUpdateProfilePhoto(arquivoBlob);
        } else{
            setLoading(false);
        }
    }

    async function handleUpdateProfilePhoto(arquivoBlob: any) {
        try{
            const refImagem = ref(storage, arquivoBlob["_data"].name); 
            const res = await uploadBytes(refImagem, arquivoBlob);
            console.log(res);
            // const url = await getDownloadURL(refImagem);
            // const userToUpdate = {
            //     ...user,
            //     image: url
            // }
            // await setData("users", userToUpdate);
            // Alert.alert("Sucesso", "Foto atualizada.");
            // setUser(userToUpdate);
            // setLoading(false);
        } catch (error) {
            console.error("Erro ao atualizar foto de perfil:", error); // Verifique o erro completo
            Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
        }
    }

    async function handleUpdateProfile(){
        
    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 200, padding: 15, justifyContent: 'space-between'}}>
                    <View style={styles.form}>
                        <View>
                            <View style={styles.userPhotoContainer}>
                                <Image
                                    style={styles.userImg}
                                    source={user.image ? {uri: user.image} : require("../../../assets/userIcon.jpg")}/>
                                <Icon name='edit' size={18} color='#3D3D3D' onPress={handlePickProfilePhoto}/>
                            </View>
                            {user.userType == "RETAILER" || user.userType == "CLIENT" &&
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='NOME COMPLETO'
                                        placeholderTextColor={mainStyles.mainColors.primaryColor}
                                        onChangeText={(text) => setName(text)}
                                        value={name}/>
                                </View>
                            }
                            {user.userType == "RETAILER" &&
                                <View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='RETAILER'
                                        placeholderTextColor={mainStyles.mainColors.primaryColor}
                                        onChangeText={(text) => setName(text)}
                                        value={name}/>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='RETAILER'
                                        placeholderTextColor={mainStyles.mainColors.primaryColor}
                                        onChangeText={(text) => setName(text)}
                                        value={name}/>
                                </View>
                            }
                        </View>
                    </View>

                    <View style={styles.btnsContainer}>
                        <TouchableOpacity 
                            style={[styles.button, {backgroundColor: 'white'}]} 
                            onPress={() => router.back()}>
                            <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
      </Fragment>
    )
}

const styles = StyleSheet.create({
    // userPhotoContainer
    userPhotoContainer: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 40,
    },
    userImg: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },

    // Form
    form: {
        marginBottom: 100,
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

    // btnsContainer
    btnsContainer: {
        // marginTop: 100
        gap: 15,
    },

    button: {
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 12,
        borderRadius: 8,
        width: '70%',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor
    }
});