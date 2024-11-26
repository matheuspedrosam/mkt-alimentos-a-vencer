import { View, Text, StyleSheet, TextInput, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
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
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import orderArray from '../../../utils/orderAlg';
import * as Location from 'expo-location';
import GooglePlacesAutocomplete from '../../../components/GooglePlacesAutocomplete';
import useUserStore from '../../../store/user';


interface ClientHomeScreenProps{
}

export default function ClientHomeScreen(props: ClientHomeScreenProps) {
    const { user, setUser } = useUserStore();
    const { height } = useWindowDimensions();
    const { getData, getDataByQuery, filterDataByRadius, } = useFetchData();

    const [location, setLocation] = useState(null);

    const [ entity, setEntity ] = useState(null);
    const [ displayEntity, setDisplayEntity ] = useState(null);
    const [ category, setCategory ] = useState("Todos");
    const [ searchConfings, setSearchConfigs ] = useState(null);
    const [ selectedOrderBtn, setSelectedOrderBtn ] = useState(null);
    const [ filterConfigs, setFilterConfigs ] = useState(null);
    const [ orderConfigs, setOrderConfigs ] = useState(null);

    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ reload, setReload ] = useState(false);

    const [ currentPage, setCurrentPage ] = useState(0);
    const [ startDisplayPagination, setStartDisplayPagination ] = useState(0);
    const [ endDisplayPagination, setEndDisplayPagination ] = useState(2);

    const [modalType, setModalType] = useState(null);
    const modalRef = useRef(null);
    const [ priceRange, setPriceRange ] = useState(0);

    // PriceSlider
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(1000);

    async function getCurrentLocation() {
        if(user.lastLocation){
            setLocation(user.lastLocation);
        } else{
            setLocation({latitude: -9.6654638, longitude: -35.7109847, description: "Pajuçara, Maceió"}) // Default "Pajuçara, Maceió"
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }
        
        let deviceLocation = await Location.getCurrentPositionAsync({});
        if(!deviceLocation){
            return;
        }

        let deviceLocationNAME = await Location.reverseGeocodeAsync(location);
        setLocation({
            latitude: deviceLocation.coords.latitude,
            longitude: deviceLocation.coords.longitude,
            description: deviceLocationNAME
        });
    }
      
    useEffect(() => {
        resetFilters();
        if(!location){
            getCurrentLocation();
        }
        async function getProducts(){
            setLoading(true);
            let data: any;
            data = await getData("products");
            if(data.length === 0){
                setEntity(null);
                setDisplayEntity(null);
                setLoading(false);
                return;
            }
            let retailers: any = await getDataByQuery("users", "userType", "==", "RETAILER");
            
            if(location){
                retailers = filterDataByRadius(retailers, {latitude: location.latitude, longitude: location.longitude}, 50);
            }
            let products: any;
            if(retailers && retailers.length > 0){
                products = mapProductsWithRetailers(data, retailers);
                const paginatedProducts = paginateArray(products);
                setEntity(products);
                setDisplayEntity(paginatedProducts);
            } else{
                setEntity(null);
                setDisplayEntity(null);
            }
            setLoading(false);
        }
        getProducts();
    }, [reload, location])

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

        // 2. Category change
        if (category && category != "Todos") {
            filteredData = filteredData.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }

        // 3. PriceRange
        if (priceRange) {
            filteredData = filteredData.filter(item => item.newPrice <= priceRange);
        }
    
        // 4. Ordenação
        if(orderConfigs){
            filteredData = orderArray(filteredData, orderConfigs.orderField, orderConfigs.orderDirection);
        }

        if(filteredData.length === 0){
            setDisplayEntity(null);
            return;
        }
        setDisplayEntity(paginateArray(filteredData));
    }, [entity, searchConfings, category, orderConfigs, priceRange]);

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

    function handleOpenFiltersModal(){
        setModalType("filtersModal");
        modalRef.current.open();
    }

    function handleOpenChangeLocationModal(){
        setModalType("locationModal");
        modalRef.current.open();
    }

    function handleOrderByClick(btnId: string, orderField: string, orderDirection: string){
        setSelectedOrderBtn(btnId);
        setOrderConfigs({orderField, orderDirection});
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
                            onPress={handleOpenFiltersModal}/>
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
            <ChangeLocation location={location} onClick={handleOpenChangeLocationModal}/>

            {/* Modal */}
            <Modalize
                adjustToContentHeight={true}
                ref={modalRef}
                snapPoint={600}
            >
                {modalType === "filtersModal" && 
                    <View style={{padding: 30, paddingBottom: 60}}>
                        <Text style={{fontWeight: 'bold', fontSize: 22, marginBottom: 20}}>Filtros</Text>
                        <View style={{marginBottom: 20}}>
                            <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Limite de preço: R$ {priceRange}</Text>
                                <Slider
                                    theme={{
                                        disableMinTrackTintColor: '#fff',
                                        maximumTrackTintColor: '#d3d3d3',
                                        minimumTrackTintColor: mainStyles.mainColors.primaryColor,
                                        cacheTrackTintColor: '#333',
                                        bubbleBackgroundColor: '#666',
                                        heartbeatColor: '#999',
                                    }}
                                    onSlidingComplete={(value) => setPriceRange(Number(value.toFixed(2)))}
                                    progress={progress}
                                    minimumValue={min}
                                    maximumValue={max}
                                />
                        </View>
                        <View style={{marginBottom: 30}}>
                            <Text style={{marginBottom: 10, fontWeight: 'bold'}}>Ordernar por:</Text>
                            {
                                [
                                    {id:'name-asc', title: 'Nome', field: 'name', order: 'asc', icon: 'sort'},
                                    {id:'name-desc', title: 'Nome', field: 'name', order: 'desc', icon: 'sort'},
                                    {id:'price-asc', title: 'Preço', field: 'newPrice', order: 'asc', icon: 'attach-money'},
                                    {id:'price-desc', title: 'Preço', field: 'newPrice', order: 'desc', icon: 'attach-money'},
                                    {id:'date-asc', title: 'Validade', field: 'validityDate', order: 'asc', icon: 'event'},
                                    {id:'date-desc', title: 'Validade', field: 'validityDate', order: 'desc', icon: 'event'}
                                
                                ].map((orderBtn) => (
                                    <TouchableOpacity
                                        key={orderBtn.id} 
                                        style={[styles.modalOrderBtn, selectedOrderBtn == orderBtn.id && styles.modalOrderBtnSelected]}
                                        onPress={() => handleOrderByClick(orderBtn.id, orderBtn.field, orderBtn.order)}
                                    >
                                        <Icon name={orderBtn.icon} size={18}/>
                                        <Text>{orderBtn.title}</Text>
                                        <Icon name={orderBtn.order == "asc" ? 'arrow-upward' : 'arrow-downward'} size={18}/>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <View style={styles.modalBtnsContainer}>
                            <TouchableOpacity 
                                style={[styles.modalBtn]}
                                onPress={() => modalRef.current.close()}
                            >
                                <Text style={{color: 'white'}}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {modalType === "locationModal" && 
                    <View style={{padding: 30, paddingBottom: 60}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 10}}>Trocar Localização:</Text>
                        <GooglePlacesAutocomplete location={location} setLocation={setLocation} modalRef={modalRef} setLoading={setLoading} />
                    </View>
                }
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
        width: '100%',
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: mainStyles.mainColors.primaryColor,
    },
});