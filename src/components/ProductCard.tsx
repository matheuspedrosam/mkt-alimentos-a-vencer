import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { mainStyles } from '../utils/mainStyles';
import { Icon } from '@rneui/base';
import { router } from 'expo-router';
import textAbbr from '../utils/textAbbr';

export interface ProductCardProps {
    
}

export function ProductCard (props: any) {
    const { name, category, image, oldPrice, newPrice, retailer } = props.product;

    function handleChangeScreen(){
        router.push({
            pathname: "Product/ProductScreen",
            params: {product: JSON.stringify({ ...props.product, image: encodeURIComponent(image), retailerImage: encodeURIComponent(retailer.image)})}
        });
    }

    return (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={handleChangeScreen}>
                <View style={styles.productCardCategoryContainer}>
                    <Icon name='category' size={16} color={mainStyles.mainColors.primaryColor}/>
                    <Text style={{color: mainStyles.mainColors.primaryColor}}>{category}</Text>
                </View>
                <View style={styles.productCardImgContainer}>
                    <Image style={{ width: '100%', height: '100%' }} source={{uri: image}}/>
                </View>
                <View style={styles.productCardDescriptionsContainer}>
                    <Text style={styles.productCardTitle}>
                        {name.length > 12 ? textAbbr(name, 12) : name}
                    </Text>
                    <View style={styles.productCardPriceContainer}>
                        <Text style={styles.productOldPrice}>{oldPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</Text>
                        <Text style={styles.productNewPrice}>{newPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</Text>
                    </View>
                    <View style={styles.productLocationContainer}>
                        <Icon name='location-on' color={mainStyles.mainColors.primaryColor}/>
                        <Text style={{color: mainStyles.mainColors.primaryColor}}>
                            { retailer.establishmentName || retailer.neighborhood }
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    productCard: {
        width: '48%',
        backgroundColor: mainStyles.mainColors.thirdColor,
        borderRadius: 10,
        padding: 10,
        // marginHorizontal: 5
    },
    productCardCategoryContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        paddingVertical: 2,
        paddingHorizontal: 10,
        color: mainStyles.mainColors.primaryColor,
        marginBottom: 10,
    },
    productCardImgContainer: {
        backgroundColor: 'white',
        height: 150,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 10,
    },
    productCardDescriptionsContainer: {

    },
    productCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productCardPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    productOldPrice: {
        color: 'gray',
        textDecorationLine: 'line-through',
        fontSize: 12,
    },
    productNewPrice: {
        color: mainStyles.mainColors.primaryColor,
        fontSize: 20,
        fontWeight: 'bold'
    },
    productLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 5,
    }
});