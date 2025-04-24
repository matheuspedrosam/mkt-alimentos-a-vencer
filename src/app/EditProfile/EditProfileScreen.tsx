import { Fragment, useReducer, useRef, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Image, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Header } from '../../components/Header';
import { Icon } from '@rneui/base';
import useUserStore from '../../store/user';
import { mainStyles } from '../../utils/mainStyles';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase/config';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable, uploadString } from 'firebase/storage';
import useFetchData from '../../hooks/useFetchData';
import validateUser from './userValidations';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Picker } from '@react-native-picker/picker';
import { states } from '../../db/mockedDb';
import { GeoPoint } from 'firebase/firestore';
import { API_KEY } from '@env';

export interface EditProfileScreenProps {
}

export default function EditProfileScreen (props: EditProfileScreenProps) {
    const { height } = useWindowDimensions();
    const { user, setUser } = useUserStore.getState();
    const { updateData } = useFetchData();

    const [name, setName] = useState(user.name);
    const [profilePhoto, setProfilePhoto] = useState<string | Blob>(user.image);
    const [cep, setCep] = useState(user.cep);
    const [cepLoading, setCepLoading] = useState(false);
    const [city, setCity] = useState(user.city);
    const [neighborhood, setNeighborhood] = useState(user.neighborhood);
    const [street, setStreet] = useState(user.street);
    const [number, setNumber] = useState(user.number);
    const [complement, setComplement] = useState(user.complement);
    const [establishmentName, setEstablishmentName] = useState(user.establishmentName);
    const [selectedState, setSelectedState] = useState(user.state);

    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);

    const modalRef = useRef<Modalize>(null);
            
    function openModal(e: any){
        if(Platform.OS === 'ios'){
            modalRef.current?.open();
        }
    };

    const showOptions = () => {
        Alert.alert(
          "Selecione uma opção",
          "Escolha entre tirar uma foto ou selecionar da galeria",
          [
              { text: "Cancelar", style: "cancel" },
              { text: "Galeria", onPress: handlePickImage },
              { text: "Câmera", onPress: handleTakePhoto },
          ]
        );
      };

    async function handlePickImage(){
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permissão para acessar a galeria é necessária!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            allowsMultipleSelection: false
          });
            
        if (!result.canceled) {
            const arquivo = await fetch(result.assets[0].uri);
            const arquivoBlob: any = await arquivo.blob();
            setProfilePhoto(arquivoBlob);
        }
    }

    async function handleTakePhoto(){
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permissão para acessar a câmera é necessária!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            allowsMultipleSelection: false
          });
            
        if (!result.canceled) {
            const arquivo = await fetch(result.assets[0].uri);
            const arquivoBlob: any = await arquivo.blob();
            setProfilePhoto(arquivoBlob);
        }
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

    async function handleUpdateProfile(){
        setLoading(true);

        try{
            validateUser({userType: user.userType, name, cep, state: selectedState, city, neighborhood, street, number, complement, establishmentName});
        } catch (e){
            console.log(e);
            setLoading(false);
            setError(e.message);
            return;
        }
        setError(null);

        try{
            let url: any = null;
            if(profilePhoto && typeof profilePhoto != "string"){
                const refImagem = ref(storage, `profilePhotos/${user.id}`);
                const res = await uploadBytes(refImagem, profilePhoto);
                url = await getDownloadURL(refImagem);
            }
            let userToUpdate: any;
            if(user.userType === "CLIENT"){
                userToUpdate = {
                    ...user,
                    name,
                    image: url ? url : profilePhoto
                }
            } else if (user.userType === "RETAILER"){
                userToUpdate = {
                    ...user,
                    name,
                    image: url ? url : profilePhoto,
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

                const address = `${user.street}, ${user.number}, ${user.neighborhood}, ${user.city}, ${user.state}, ${user.cep}`;
                const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`; 
                const res = await fetch(geoCodeUrl);
                const geocode = await res.json();
                const geometryLocation = geocode.results[0].geometry.location;
                const { lat, lng } = geometryLocation;
                userToUpdate.addressGeocode = new GeoPoint(lat, lng);
            }
            await updateData("users", userToUpdate.id, userToUpdate);
            Alert.alert("Sucesso", "Perfil atualizado.");
            setUser(userToUpdate);
            router.replace(user.userType === "CLIENT" ? "Home/Client/ClientHomeScreen" : "Home/Retailer/RetailerHomeScreen");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", JSON.stringify(error));
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <GestureHandlerRootView>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 300, padding: 15, justifyContent: 'space-between'}}>
                    <View style={[styles.form, {marginBottom: (user.userType === "RETAILER" ? 20 : 100)}]}>
                        <Text style={{marginBottom: 20, fontSize: 24, fontWeight: 'bold'}}>Editar Perfil</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                        <TouchableOpacity style={styles.inputContainer} onPress={showOptions}>
                            <Icon name='image' color={mainStyles.mainColors.primaryColor}/>
                            <Text style={{color: mainStyles.mainColors.primaryColor, marginLeft: 10}}>
                                {[1].map((value) => {
                                    if(!profilePhoto) return 'FOTO DE PERFIL';

                                    return typeof profilePhoto == "string" ? `${profilePhoto.slice(0, 40)}...` : profilePhoto["_data"].name
                                })}
                            </Text>
                        </TouchableOpacity>
                        <View style={[styles.input, {backgroundColor: 'rgb(240, 240, 240)', borderColor: 'gray'}]}>
                            <Text style={{color: 'gray'}}>{user.email}</Text>
                        </View>
                        {user.userType == "RETAILER" &&
                            <Fragment>
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
                            </Fragment>
                        }

                        {error && <Text style={styles.errorMessage}>Erro: {error}</Text>}
                    </View>
                </View>

                <View style={styles.btnsContainer}>
                    {!loading && 
                        <Fragment>
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor: 'white'}]}
                                onPress={() => router.back()}>
                                <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Salvar</Text>
                            </TouchableOpacity>
                        </Fragment>
                    }
                    {loading && 
                        <Fragment>
                            <TouchableOpacity
                                style={[styles.button, {backgroundColor: 'white'}]}
                                onPress={() => router.back()}>
                                <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Aguarde...</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, {backgroundColor: 'gray', borderColor: 'gray'}]}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Aguarde...</Text>
                            </TouchableOpacity>
                        </Fragment>
                    }
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
        textAlign: 'center',
        color: mainStyles.mainColors.primaryColor,
        marginTop: 10,
    },

    // btnsContainer
    btnsContainer: {
        marginBottom: 40,
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