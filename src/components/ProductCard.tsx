import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { mainStyles } from '../utils/mainStyles';
import { Icon } from '@rneui/base';
import { router } from 'expo-router';

export interface ProductCardProps {
}

export function ProductCard (props: ProductCardProps) {
    return (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => router.push("Product/ProductScreen")}>
                <View style={styles.productCardCategoryContainer}>
                    <Icon name='category' size={16} color={mainStyles.mainColors.primaryColor}/>
                    <Text style={{color: mainStyles.mainColors.primaryColor}}>Bebidas</Text>
                </View>
                <View style={styles.productCardImgContainer}>
                    {/* <Image /> */}
                    <Image style={{ width: '100%', height: '100%' }} source={{uri: 'https://s3-sa-east-1.amazonaws.com/rocky-2790b1b55c6f835a3de8629458121a7f/6a6c49bff8c6accd9fc587029190783d.png'}}/>
                </View>
                <View style={styles.productCardDescriptionsContainer}>
                    <Text style={styles.productCardTitle}>Caixa Skol Latão</Text>
                    <View style={styles.productCardPriceContainer}>
                        <Text style={styles.productOldPrice}>R$ 58,00</Text>
                        <Text style={styles.productNewPrice}>R$ 42,00</Text>
                    </View>
                    <View style={styles.productLocationContainer}>
                        <Icon name='location-on' color={mainStyles.mainColors.primaryColor}/>
                        <Text style={{color: mainStyles.mainColors.primaryColor}}>Assaí Atacadista</Text>
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