import { Fragment, useReducer, useRef, useState } from 'react';
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
    const { setData, updateData } = useFetchData();

    const [ name, setName ] = useState(user.name);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [ blobImage, setBlobImage ] = useState(null);

    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);

    async function handlePickProfilePhoto(){
        setLoading(true);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
            
        if (!result.canceled) {
            const arquivo = await fetch(result.assets[0].uri);
            const arquivoBlob = await arquivo.blob();
            setProfilePhoto(arquivoBlob)
        } else{
            setLoading(false);
        }
    }

    async function handleUpdateProfile(){
        try{
            console.log(profilePhoto);
            const refImagem = ref(storage, `${user.id}`); 
            const res = await uploadBytes(refImagem, profilePhoto);
            console.log(res);
            const url = await getDownloadURL(refImagem);
            const userToUpdate = {
                ...user,
                image: url
            }
            await updateData("users", userToUpdate.id, userToUpdate);
            Alert.alert("Sucesso", "Foto atualizada.");
            setUser(userToUpdate);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao atualizar foto de perfil:", error);
            Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
        }
    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 300, padding: 15, justifyContent: 'space-between'}}>
                    <View style={styles.form}>
                        <Text style={{marginBottom: 20, fontSize: 24, fontWeight: 'bold'}}>Editar Perfil</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                        <TouchableOpacity style={styles.inputContainer} onPress={handlePickProfilePhoto}>
                            <Icon name='image' color={mainStyles.mainColors.primaryColor}/>
                            <Text style={{color: mainStyles.mainColors.primaryColor, marginLeft: 10}}>
                                {profilePhoto ? profilePhoto["_data"].name : 'FOTO DE PERFIL'}
                            </Text>
                        </TouchableOpacity>
                        <View style={[styles.input, {backgroundColor: 'rgb(240, 240, 240)', borderColor: 'gray'}]}>
                            <Text style={{color: 'gray'}}>{user.email}</Text>
                        </View>
                        {user.userType == "RETAILER" &&
                            <Fragment>
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
                            </Fragment>
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
        marginTop: 10,
        marginBottom: 100,
    },
    inputContainer: {
        padding: 11,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: mainStyles.mainColors.primaryColor,
        backgroundColor: mainStyles.mainColors.transparentColor,
        flex: 1,
        marginBottom: 10,
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