import { Icon } from '@rneui/base';
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { mainStyles } from '../../utils/mainStyles';
import { Fragment, useEffect } from 'react';
import { Header } from '../../components/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import timestampToDate from '../../utils/timestampToDate';
import useUserStore from '../../store/user';

export interface ProductSreenProps {
}

export default function ProductSreen (props: ProductSreenProps) {
    const { user } = useUserStore();
    const { height } = useWindowDimensions();
    const productParam: any = useLocalSearchParams();
    const { name, category, image, oldPrice, newPrice, validityDate } = JSON.parse(productParam.product);
    let { retailer, retailerImage } = JSON.parse(productParam.product);

    if(user.userType === "RETAILER"){
        retailer = user;
        retailerImage = user.image;
    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 100, backgroundColor: mainStyles.mainColors.background}}>
                    <View style={styles.productContainer}>
                        <View style={styles.productImgContainer}>
                            <Image source={{uri: image}} style={styles.productImg}/>
                        </View>
                    </View>
                    <View style={styles.productDescriptionContainer}>
                        <View style={styles.productCategoryAndValidateContainer}>
                            <View style={styles.productCategoryContainer}>
                                <Icon name='category' size={16} color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor}}>{category}</Text>
                            </View>
                            <View style={styles.productValidateContainer}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>VAL: {timestampToDate(validityDate)}</Text>
                            </View>
                        </View>
                        <Text style={styles.productName}>{name}</Text>
                        <View style={styles.productLocationContainer}>
                            <View style={styles.productLocationTitleContainer}>
                                <Icon name='location-on' color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>
                                    { retailer.establishmentName || retailer.neighborhood }
                                </Text>
                            </View>
                            <Text style={styles.productLocationaddress}>
                                {retailer.street}, {retailer.number || 's/n'} - {retailer.neighborhood}, {retailer.city} - {retailer.state}, {retailer.cep}
                            </Text>
                        </View>
                        <View style={styles.retailerNameContainer}>
                            {retailerImage
                                ? (<Image source={{uri: retailerImage}} style={{width: 30, height: 30, borderRadius: 100, marginRight: 5}} />)
                                : (<Icon name='account-circle' color={mainStyles.mainColors.primaryColor} />)
                            }
                            <Text style={styles.retailerName}>{retailer.name}</Text>
                        </View>
                        <View style={styles.productPriceContainer}>
                            <Text style={styles.productOldPrice}>{oldPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</Text>
                            <Text style={styles.productNewPrice}>{newPrice.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</Text>
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
    productLocationaddress: {
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
