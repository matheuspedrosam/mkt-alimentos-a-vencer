import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { mainStyles } from '../utils/mainStyles';
import { Icon } from '@rneui/base';
import { router } from 'expo-router';
import textAbbr from '../utils/textAbbr';
import timestampToDate from '../utils/timestampToDate';
import useFetchData from '../hooks/useFetchData';

export interface ProductRowProps {
    
}

export function ProductRow (props: any) {
    const { id, name, category, image, oldPrice, newPrice, validityDate } = props.product;
    const { setLoading, setReload } = props;
    const { deleteData, deleteImageByDownloadURL } = useFetchData();

    function handleChangeScreen(){
        router.push({
            pathname: "Product/ProductScreen",
            params: {product: JSON.stringify({ ...props.product, image: encodeURIComponent(image) })}
        });
    }

    function handleEditProduct(){
        router.push({
            pathname: "RegisterProduct/RegisterProductScreen",
            params: {product: JSON.stringify({ ...props.product, image: encodeURIComponent(image) })}
        });
    }

    async function handleDeleteProduct(){
        Alert.alert('Excluir', `Realmente deseja excluir ${name}?`, [
            { text: 'Cancel', onPress: null, },
            { text: 'OK', onPress: async () => {
                try{
                    setLoading(true);
                    await deleteImageByDownloadURL(image);
                    await deleteData("products", id);
                } catch(e){
                    console.log(e);
                    Alert.alert("Error", "Erro ao excluir, por favor tente novamente mais tarde.")
                } finally {
                    setLoading(false);
                    setReload((prev: any) => !prev);
                }
            }},
        ]);
    }

    return (
        <TouchableOpacity onPress={handleChangeScreen}>
            <View style={styles.productRow}>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                        <View style={styles.productRowImgContainer}>
                            <Image style={{ width: '100%', height: '100%', borderRadius: 5 }} source={{uri: image}}/>
                        </View>
                        <View style={styles.productRowDescriptionsContainer}>
                            <Text style={styles.productRowTitle}>
                                {name.length > 12 ? textAbbr(name, 12) : name}
                            </Text>
                            <View style={styles.productValidateContainer}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>VAL: {timestampToDate(validityDate)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.productIconsContanier}>
                        <TouchableOpacity style={styles.productIconBtn} onPress={handleEditProduct}>
                            <Icon name='edit' color={mainStyles.mainColors.primaryColor} size={28}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.productIconBtn} onPress={handleDeleteProduct}>
                            <Icon name='delete' color={mainStyles.mainColors.primaryColor} size={28}/>
                        </TouchableOpacity>
                    </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    productRow: {
        backgroundColor: mainStyles.mainColors.thirdColor,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    productRowImgContainer: {
        backgroundColor: 'white',
        height: 75,
        width: 75,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    productRowDescriptionsContainer: {

    },
    productRowTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    productValidateContainer: {
        borderRadius: 30,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        paddingVertical: 2,
        paddingHorizontal: 10,
        backgroundColor: mainStyles.mainColors.primaryColor,
    },

    productIconsContanier:{
        flexDirection: 'row',
        gap: 10
    },
    productIconBtn:{
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        padding: 5,
        borderRadius: 10
    },
});