import { Icon } from '@rneui/base';
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { mainStyles } from '../../utils/mainStyles';
import { Fragment } from 'react';
import { Header } from '../../components/Header';

export interface ProductSreenProps {
}

export default function ProductSreen (props: ProductSreenProps) {
    const { height } = useWindowDimensions();

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 100, backgroundColor: mainStyles.mainColors.background}}>
                    <View style={styles.productContainer}>
                        <View style={styles.productImgContainer}>
                            <Image src='https://s3-sa-east-1.amazonaws.com/rocky-2790b1b55c6f835a3de8629458121a7f/6a6c49bff8c6accd9fc587029190783d.png' style={styles.productImg}/>
                        </View>
                    </View>
                    <View style={styles.productDescriptionContainer}>
                        <View style={styles.productCategoryAndValidateContainer}>
                            <View style={styles.productCategoryContainer}>
                                <Icon name='category' size={16} color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor}}>Bebidas</Text>
                            </View>
                            <View style={styles.productValidateContainer}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>VAL: {'20/10/2024'}</Text>
                            </View>
                        </View>
                        <Text style={styles.productName}>Caixa Skol Latão 350ml</Text>
                        <View style={styles.productLocationContainer}>
                            <View style={styles.productLocationTitleContainer}>
                                <Icon name='location-on' color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Assaí Atacadista</Text>
                            </View>
                            <Text style={styles.productLocationAdress}>
                                Menino Marcelo, s/n - Serraria, Maceió - AL, 57046-000
                            </Text>
                        </View>
                        <View style={styles.retailerNameContainer}>
                            <Icon name='account-circle' color={mainStyles.mainColors.primaryColor} />
                            <Text style={styles.retailerName}>Nome do Varejista</Text>
                        </View>
                        <View style={styles.productPriceContainer}>
                            <Text style={styles.productOldPrice}>R$ 38,00</Text>
                            <Text style={styles.productNewPrice}>R$ 42,00</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
      </Fragment>
    );
}

const styles = StyleSheet.create({
    // Product
    productContainer: {
        backgroundColor: mainStyles.mainColors.thirdColor,
        padding: 30,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productImgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 300,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
    },
    productImg: {
        width: '100%',
        height: '100%',
    },

    // ProductDescription
    productDescriptionContainer: {
        padding: 15,
    },

    // CategoryAndValidateContainer
    productCategoryAndValidateContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    productCategoryContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        paddingVertical: 2,
        paddingHorizontal: 10,
        color: mainStyles.mainColors.primaryColor,
    },
    productValidateContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        paddingVertical: 2,
        paddingHorizontal: 10,
        backgroundColor: mainStyles.mainColors.primaryColor,
    },

    // productName
    productName: {
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 20
    },

    // productLocationContainer
    productLocationContainer: {
        marginBottom: 20
    },
    productLocationTitleContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    productLocationAdress: {
        marginLeft: 30,
        color: 'gray',
    },

    // retailerNameContainer
    retailerNameContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    retailerName: {
        color: mainStyles.mainColors.primaryColor,
        fontWeight: 'bold'
    },

    // productPriceContainer
    productPriceContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    productOldPrice: {
        textDecorationLine: 'line-through',
        color: 'gray',
        fontSize: 16
    },
    productNewPrice: {
        color: mainStyles.mainColors.primaryColor,
        fontSize: 26,
        fontWeight: 'bold'
    },
});
