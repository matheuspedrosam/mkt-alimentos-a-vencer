import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView, FlatList, useWindowDimensions, TouchableOpacity, Alert } from 'react-native'
import { mainStyles } from '../../../utils/mainStyles';
import { Icon } from '@rneui/base';
import { ProductCard } from '../../../components/ProductCard';
import { Fragment, useEffect, useRef, useState } from 'react';
import { CategoriesList } from '../../../components/CategoriesList';
import { Header } from '../../../components/Header';
import { ChangeLocation } from '../../../components/ChangeLocation';
import Loader from '../../../components/Loader';
import useFetchData from '../../../hooks/useFetchData';
import paginateArray from '../../../utils/paginateArray';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';

interface ClientHomeScreenProps{
}

export default function ClientHomeScreen(props: ClientHomeScreenProps) {
    const { height } = useWindowDimensions();
    const { getData, getDataByQuery, setData } = useFetchData();

    const [ entity, setEntity ] = useState(null);
    const [ displayEntity, setDisplayEntity ] = useState(null);
    const [ category, setCategory ] = useState("Todos");
    const [ searchConfings, setSearchConfigs ] = useState(null);
    const [ filterConfigs, setFilterConfigs ] = useState(null);
    const [ orderConfigs, setOrderConfigs ] = useState(null);

    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ reload, setReload ] = useState(false);

    const [ currentPage, setCurrentPage ] = useState(0);
    const [ startDisplayPagination, setStartDisplayPagination ] = useState(0);
    const [ endDisplayPagination, setEndDisplayPagination ] = useState(2);

    const modalRef = useRef(null);
    const [ priceRange, setPriceRange ] = useState(0);

    useEffect(() => {
        resetFilters();
        async function getProducts(){
            setLoading(true);
            let data: any;
            if(category === "Todos"){
                data = await getData("products");
            } else{
                data = await getDataByQuery("products", "category", "==", category);
            }
            if(data.length === 0){
                setEntity(null);
                setDisplayEntity(null);
                setLoading(false);
                return;
            }
            const retailers: any = await getDataByQuery("users", "userType", "==", "RETAILER");
            const products = mapProductsWithRetailers(data, retailers);
            const paginatedProducts = paginateArray(products);
            setEntity(products);
            setDisplayEntity(paginatedProducts);
            setLoading(false);
        }
        getProducts();
    }, [category, reload])

    function resetFilters(){
        setEntity(null);
        setDisplayEntity(null);
        setCurrentPage(0);
        setStartDisplayPagination(0);
        setEndDisplayPagination(2);
        setSearchConfigs(null);
        setOrderConfigs(null);
        setFilterConfigs(null);
    }

    useEffect(() => {
        if(!entity) return;
        let filteredData = [...entity];

        // 1. Busca
        if (searchConfings) {
          filteredData = filteredData.filter(item =>
            item['name'].toLowerCase().includes(searchConfings.searchTerm.toLowerCase())
          );
        }

        // 2. Filtro
        // if (filterConfigs) {
        //     filteredData = filteredData.filter(item => item[filterConfigs.filter] === filterConfigs.condicao);
        //     }
    
        // 3. Ordenação
        // if(orderConfigs){
        //     filteredData = filteredData.sort((a, b) => {
        //         if(Number(a[orderConfigs.orderField])){
        //             return orderConfigs.orderDirection === 'asc' 
        //                 ? Number(a[orderConfigs.orderField]) - Number(b[orderConfigs.orderField])
        //                 : Number(b[orderConfigs.orderField]) - Number(a[orderConfigs.orderField])
        //         } else if (typeof a[orderConfigs.orderField] === 'string') {
        //             return orderConfigs.orderDirection === 'asc' 
        //                 ? a[orderConfigs.orderField].localeCompare(b[orderConfigs.orderField])
        //                 : b[orderConfigs.orderField].localeCompare(a[orderConfigs.orderField])
        //         }
        //     });
        // }
        if(filteredData.length === 0){
            setDisplayEntity(null);
            return;
        }
        setDisplayEntity(paginateArray(filteredData));
    }, [entity, searchConfings, filterConfigs, orderConfigs]);

    useEffect(() => {
        if(!entity) return;
        calcDisplayPagination();
    }, [currentPage])

    function mapProductsWithRetailers(products: any, retailers: any){
        return products.map((product: any) => {
            const retailer = retailers.filter((doc: any) => doc.id === product.retailerId)[0];
            return { ...product, retailer, retailerId: undefined }
        })
    }

    function handleDecrementPage(){
        setCurrentPage((prevState) => {
            return prevState != 0 ? prevState - 1 : prevState
        })
    }

    function handleIncrementPage(){
        setCurrentPage((prevState) => {
            return prevState < (displayEntity.length - 1) ? prevState + 1 : prevState
        })
    }

    function calcDisplayPagination(){
        if(currentPage === 0){
            setStartDisplayPagination(0);
            setEndDisplayPagination(2);
        } else if(currentPage > 0 && currentPage < displayEntity.length - 1){
            setStartDisplayPagination(currentPage - 1);
            setEndDisplayPagination(currentPage + 1);
        } else if (currentPage === displayEntity.length - 1){
            setStartDisplayPagination(currentPage - 2);
            setEndDisplayPagination(currentPage);
        }
    }

    function handleOpenModal(){
        modalRef.current.open();
    }

    return (
        <GestureHandlerRootView style={{height: height, backgroundColor: mainStyles.mainColors.background}}>
            <Header />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.inputAndFilterContainer}>
                        <View style={styles.inputContainer}>
                            <Icon name='search' color={mainStyles.mainColors.primaryColor}/>
                            <TextInput
                                onChangeText={(text) => setSearchConfigs({ searchTerm: text })}
                                style={styles.input} 
                                placeholder='Buscar...' 
                                placeholderTextColor={mainStyles.mainColors.primaryColor}/>
                        </View>
                        <Icon 
                            name='filter-list' 
                            style={styles.filterIconBtn}
                            color={mainStyles.mainColors.primaryColor}
                            onPress={handleOpenModal}/>
                    </View>
                    <View style={styles.categoriesContainer}>
                        <Text style={{fontWeight: 'bold'}}>Categorias</Text>
                        <CategoriesList category={category} setCategory={setCategory}/>
                    </View>
                    {loading ? (<Loader />) : (
                        <Fragment>                            
                            <View style={styles.productsContainer}>
                                {displayEntity && displayEntity[currentPage].map((product: any) => (
                                    <ProductCard key={product.id} product={product}/>
                                ))}
                            </View>
                            
                            {!displayEntity && <Text style={{textAlign: 'center'}}>Nenhum produto foi encontrado...</Text>}

                            {displayEntity && displayEntity.length > 1 &&
                                <View style={styles.paginationContainer}>
                                    <View style={styles.paginationComponent}>
                                        <Icon name='chevron-left' onPress={handleDecrementPage}/>
                                        {displayEntity.map((value: any, index: number) => {
                                            if(index >= startDisplayPagination && index <= endDisplayPagination){
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[styles.pageBtn, currentPage === index && styles.selectedPageBtn]} 
                                                        onPress={() => setCurrentPage(index)}
                                                    >
                                                        <Text style={styles.pageBtnText}>{index + 1}</Text>
                                                    </TouchableOpacity>
                                                );
                                            }
                                        })}
                                        <Icon name='chevron-right' onPress={handleIncrementPage}/>
                                    </View>
                                </View>
                            }

                        </Fragment>
                    )}
                </View>
            </ScrollView>

            {/* ChangeLocation */}
            <ChangeLocation />

            {/* Modal */}
            <Modalize
                adjustToContentHeight={true}
                ref={modalRef}
                snapPoint={600}
            >
                <View style={{padding: 30, paddingBottom: 60}}>
                    <Text style={{fontWeight: 'bold', fontSize: 22, marginBottom: 20}}>Filtros</Text>
                    <View style={{marginBottom: 20}}>
                        <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Limite de preço: R$ {priceRange},00</Text>
                        <Slider
                            style={{marginLeft: -5}}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={priceRange}
                            onValueChange={(val) => setPriceRange(val)}
                            minimumTrackTintColor={mainStyles.mainColors.primaryColor}
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor={mainStyles.mainColors.primaryColor}
                        />
                    </View>
                    <View style={{marginBottom: 30}}>
                        <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Ordernar por:</Text>
                        <TouchableOpacity style={[styles.modalOrderBtn, styles.modalOrderBtnSelected]}>
                            <Icon name='attach-money' size={18}/>
                            <Text>Preço</Text>
                            <Icon name='arrow-upward' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOrderBtn}>
                            <Icon name='attach-money' size={18}/>
                            <Text>Preço</Text>
                            <Icon name='arrow-downward' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOrderBtn}>
                            <Icon name='near-me' size={18}/>
                            <Text>Distancia</Text>
                            <Icon name='arrow-upward' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOrderBtn}>
                            <Icon name='near-me' size={18}/>
                            <Text>Distancia</Text>
                            <Icon name='arrow-downward' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOrderBtn}>
                            <Icon name='trending-down' size={18}/>
                            <Text>Desconto</Text>
                            <Icon name='arrow-upward' size={18}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOrderBtn}>
                            <Icon name='trending-down' size={18}/>
                            <Text>Desconto</Text>
                            <Icon name='arrow-downward' size={18}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBtnsContainer}>
                        <TouchableOpacity 
                            style={[styles.modalBtn, {backgroundColor: 'white'}]}
                            onPress={() => modalRef.current.close()}
                        >
                            <Text style={{color: mainStyles.mainColors.primaryColor}}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalBtn}>
                            <Text style={{color: 'white'}}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modalize>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    // Container
    container: {
        padding: 15,
    },

    // Input And Filter
    inputAndFilterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        backgroundColor: mainStyles.mainColors.thirdColor,
        flex: 1,
    },
    input: {
        width: '100%',
        padding: 10,
        fontWeight: '500',
    },
    filterIconBtn: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
        backgroundColor: mainStyles.mainColors.thirdColor,
    },

    // Categories
    categoriesContainer: {
        marginBottom: 20,
    },

    // Products
    productsContainer: {
        marginHorizontal: -4,
        gap: 10,
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    // Pagination
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },

    paginationComponent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    pageBtn: {
        minWidth: 30,
        minHeight: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },

    selectedPageBtn: {
        backgroundColor: mainStyles.mainColors.thirdColor,
        borderColor: mainStyles.mainColors.primaryColor,
        borderWidth: 2,
    },

    pageBtnText: {
        fontWeight: 'bold',
    },

    selectedpageBtnText: {
        color: mainStyles.mainColors.primaryColor
    },

    // Modal
    modalOrderBtn: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    modalOrderBtnSelected: {
        backgroundColor: '#D3D3D3'
    },

    modalBtnsContainer:{
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center'
    },
    modalBtn:{
        borderRadius: 4,
        width: '47%',
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
    },
});