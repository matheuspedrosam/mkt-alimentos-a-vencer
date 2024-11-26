import { Fragment, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform, Button, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { Icon } from '@rneui/base';
import { mainStyles } from '../../utils/mainStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import timestampToDate from '../../utils/timestampToDate';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/config';
import useUserStore from '../../store/user';
import useFetchData from '../../hooks/useFetchData';
import { Timestamp } from 'firebase/firestore';
import validateProduct from './productValidations';

export interface RegisterProductScreenProps {
}

export default function RegisterProductScreen (props: RegisterProductScreenProps) {
    const { height } = useWindowDimensions();
    const { user } = useUserStore();

    const productParam: any = useLocalSearchParams();
    let productParsed: any;
    if(productParam.product) {
        productParsed = JSON.parse(productParam.product);
    }

    const [name, setName] = useState(productParsed ? productParsed.name : null);
    const [image, setImage] = useState(productParsed ? productParsed.image : null);
    const [date, setDate] = useState(productParsed ? timestampToDate(productParsed.validityDate, false) : new Date());
    const [show, setShow] = useState(false);
    const [oldPrice, setOldPrice] = useState(productParsed ? maskMoneyInput(String(productParsed.oldPrice)) : null);
    const [newPrice, setNewPrice] = useState(productParsed ? maskMoneyInput(String(productParsed.newPrice)) : null);
    const [categories, setCategories] = useState(null);
    // const categoriesData = categories.slice(1, categories.length);
    const [selectedCategory, setSelectedCategory] = useState(productParsed ? productParsed.category : null);
    const modalRef = useRef(null);

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const {getData, setData, updateData, deleteImageByDownloadURL} = useFetchData();

    useEffect(() => {
        async function getCategories(){
            const data = await getData("categories");
            setCategories(data);
        }
        getCategories();
    })

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        const adjustedDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
        setShow(Platform.OS === 'ios'); // No iOS, mantém o picker aberto
        setDate(adjustedDate); // Atualiza a data selecionada
    };

    const showDatePicker = () => {
        setShow(true);
    };

    function openModal(e: any){
        if(Platform.OS === 'ios'){
            modalRef.current?.open();
        }
    };

    function maskMoneyInput(value: string){
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d+)(\d{2})$/, "$1,$2");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        value = "R$ " + value;
        return value;
    }

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
            const arquivoBlob = await arquivo.blob();
            setImage(arquivoBlob);
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
            const arquivoBlob = await arquivo.blob();
            setImage(arquivoBlob);
        }
    }
        
    function clearFields(){
        setName('');
        setImage('');
        setData('');
        setNewPrice('');
        setOldPrice('');
        setSelectedCategory('Categoria');
    }

    async function handleSaveProduct(){
        setLoading(true);

        try{
            validateProduct({name, image, validityDate: date, oldPrice, newPrice, category: selectedCategory});
        } catch (e){
            console.log(e);
            setLoading(false);
            setError(e.message);
            return;
        }
        setError(null);

        let url: string;
        if(typeof image === "object"){
            if(productParsed) {
                await deleteImageByDownloadURL(productParsed.image);
            }
            try {
                const refImagem = ref(storage, `productsImages/${user.id}-${Date.now()}`);
                await uploadBytes(refImagem, image);
                url = await getDownloadURL(refImagem);
            } catch (e){
                console.log(e);
                Alert.alert("Erro", "erro ao adicionar foto do produto.");
                setLoading(false);
                return;
            }
        }

        const product = {
            name,
            image: productParsed && typeof image == "string" ? image : url,
            validityDate: Timestamp.fromDate(new Date(date)),
            oldPrice: Number.parseFloat(oldPrice.replace("R$ ", "").replace(".", "").replace(",", ".")),
            newPrice: Number.parseFloat(newPrice.replace("R$ ", "").replace(".", "").replace(",", ".")),
            retailerId: user.id,
            category: selectedCategory
        }
    
        if(!productParsed){
            // HandleSave

            try{
                await setData("products", product);
                Alert.alert("Sucesso", "Produto adicionado.");
            } catch (error) {
                console.error("Erro ao adicionar produto:", JSON.stringify(error));
                Alert.alert("Erro", "Não foi possível adicionar o produto.");
            } finally {
                setLoading(false);
                clearFields();
            }
        } else if(productParsed){
            // HandleEDIT

            try{
                await updateData("products", productParsed.id, Object.assign(productParsed, product));
                Alert.alert("Sucesso", "Produto atualizado.");
            } catch (error) {
                console.error("Erro ao atualizar produto:", JSON.stringify(error));
                Alert.alert("Erro", "Não foi possível atualizar o produto.");
            } finally {
                setLoading(false);
                router.replace("Home/Retailer/RetailerHomeScreen")
            }
        }
    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <GestureHandlerRootView>
                <ScrollView>
                    <View style={{minHeight: height - 300, padding: 15, justifyContent: 'space-between'}}>
                        <View style={styles.form}>
                            <Text style={{marginBottom: 20, fontSize: 24, fontWeight: 'bold'}}>
                                {productParsed ? 'Editar' : 'Salvar'} Produto
                            </Text>

                            <View style={styles.labelContainer}><Text style={styles.label}>NOME DO PRODUTO</Text></View>
                            <TextInput
                                style={styles.input}
                                placeholder='NOME DO PRODUTO'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                value={name}
                                onChangeText={(text) => setName(text)}/>
                            
                            <View style={styles.labelContainer}><Text style={styles.label}>FOTO DO PRODUTO</Text></View>
                            <TouchableOpacity style={styles.inputContainer} onPress={showOptions}>
                                <Icon name='image' color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor, marginLeft: 10}}>
                                    {[1].map((value) => {
                                        if(productParsed){
                                            return typeof image == "string" ? `${image.slice(0, 40)}...` : image["_data"].name
                                        } else if(!productParsed){
                                            return image ? image["_data"].name : 'FOTO DO PRODUTO'
                                        }
                                    })}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.labelContainer}><Text style={styles.label}>DATA DE VALIDADE</Text></View>
                            {Platform.OS === "android" &&                        
                                <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
                                    <Icon name='event' color={mainStyles.mainColors.primaryColor}/>
                                    <Text style={{color: mainStyles.mainColors.primaryColor, marginLeft: 10}}>
                                        {date ? new Date(date).toLocaleDateString("pt-br") : 'DATA DE VALIDADE'}
                                    </Text>
                                    {show && (
                                        <DateTimePicker
                                            value={new Date(date)}
                                            mode="date"
                                            display="default"
                                            onChange={onChange}
                                            timeZoneOffsetInMinutes={0}
                                        />
                                    )}
                                </TouchableOpacity>
                            }
                            {Platform.OS === "ios" &&                        
                                <View style={[styles.inputContainer, {paddingVertical: 6}]}>
                                    <Icon name='event' color={mainStyles.mainColors.primaryColor}/>
                                    <DateTimePicker
                                        value={new Date(date)}
                                        mode="date"
                                        display="default"
                                        onChange={onChange}
                                    />
                                </View>
                            }

                            <View style={styles.labelContainer}><Text style={styles.label}>PREÇO ORIGINAL DO PRODUTO</Text></View>
                            <TextInput
                                style={styles.input}
                                placeholder='R$'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                value={oldPrice}
                                onChangeText={(text) => setOldPrice(maskMoneyInput(text))}
                                keyboardType="numeric"/>

                            <View style={styles.labelContainer}><Text style={styles.label}>PREÇO DO PRODUTO COM DESCONTO</Text></View>
                            <TextInput
                                style={styles.input}
                                placeholder='R$'
                                placeholderTextColor={mainStyles.mainColors.primaryColor}
                                value={newPrice}
                                onChangeText={(text) => setNewPrice(maskMoneyInput(text))}
                                keyboardType="numeric"/>

                            <View style={styles.labelContainer}><Text style={styles.label}>CATEGORIA DO PRODUTO</Text></View>
                            <View style={[styles.picker, styles.inputGrid, {marginBottom: 40}]} onTouchEnd={openModal}>
                                {Platform.OS === 'android' &&
                                    <Picker
                                        selectedValue={selectedCategory}
                                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                    >
                                        <Picker.Item label="Categoria" value="" />
                                        {categories && categories.map((category: any) => (
                                            <Picker.Item key={category.name} label={category.name} value={category.name} />
                                        ))}
                                    </Picker>
                                }
                                {Platform.OS === 'ios' &&
                                    <View
                                        style={{height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text>{selectedCategory || 'Estado'}</Text>
                                        <Icon name='arrow-drop-down'/>
                                    </View>
                                }
                            </View>
                            {error && <Text style={styles.errorMessage}>Erro: {error}</Text>}
                        </View>
                    </View>
                            

                    <View style={styles.btnsContainer}>
                        {!loading && 
                            <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Salvar</Text>
                            </TouchableOpacity>
                        }
                        {loading && 
                            <View style={[styles.button, {backgroundColor: 'gray', borderColor: 'gray'}]}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Aguarde...</Text>
                            </View>
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
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                            >
                            <Picker.Item label="Categoria" value="" />
                            {categories && categories.map((category: any) => (
                                <Picker.Item key={category.name} label={category.name} value={category.name} />
                            ))}
                    </Picker>
                </Modalize>
        </GestureHandlerRootView>
      </Fragment>
    )
}

const styles = StyleSheet.create({
    // Form
    form: {
        marginTop: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    label: {
        fontWeight: 'bold',
        color: mainStyles.mainColors.primaryColor
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
        marginBottom: 20,
    },
    input: {
        backgroundColor: mainStyles.mainColors.transparentColor,
        padding: 15,
        borderRadius: 5,
        borderColor: mainStyles.mainColors.primaryColor,
        borderWidth: 1,
        textDecorationColor: mainStyles.mainColors.primaryColor,
        marginBottom: 20
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
