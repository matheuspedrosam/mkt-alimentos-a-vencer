import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView, FlatList } from 'react-native'
import { mainStyles } from '../../../utils/mainStyles';
import { Icon } from '@rneui/base';
import { ProductCard } from '../../../components/ProductCard';
import { Fragment, useState } from 'react';
import { CategoriesList } from '../../../components/CategoriesList';

interface ClientHomeScreenProps{
}

export default function ClientHomeScreen(props: ClientHomeScreenProps) {
    const [ category, setCategory ] = useState("Todos");

    console.log(category);

    return (
        <Fragment>
            <ScrollView>
                <View style={styles.changeLocationContainer}>
                    <Icon name='location-on' color={'white'}/>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Testeee, Maceió</Text>
                    <Icon name='keyboard-arrow-down' color={'white'}/>
                </View>
                <View style={styles.container}>
                    <View style={styles.inputAndFilterContainer}>
                        <View style={styles.inputContainer}>
                            <Icon name='search' color={mainStyles.mainColors.primaryColor}/>
                            <TextInput style={styles.input} placeholder='Buscar...' placeholderTextColor={mainStyles.mainColors.primaryColor}/>
                        </View>
                        <Icon name='filter-list' style={styles.filterIconBtn} color={mainStyles.mainColors.primaryColor}/>
                    </View>
                    <View style={styles.categoriesContainer}>
                        <Text style={{fontWeight: 'bold'}}>Categorias</Text>
                        <CategoriesList category={category} setCategory={setCategory}/>
                    </View>
                    <View style={styles.productsContainer}>
                        <FlatList
                            data={[1, 2, 3, 4, 5, 6]}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (<ProductCard key={item} />)}
                            numColumns={2}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    </View>
                    <View style={styles.paginationContainer}>
                        <View style={styles.paginationComponent}>
                            <Icon name='chevron-left' />
                            <View style={[styles.pageBtn, styles.selectedPageBtn]}>
                                <Text style={[styles.pageBtnText, styles.selectedpageBtnText]}>1</Text>
                            </View>
                            <View style={styles.pageBtn}>
                                <Text style={styles.pageBtnText}>2</Text>
                            </View>
                            <View style={styles.pageBtn}>
                                <Text style={styles.pageBtnText}>3</Text>
                            </View>
                            <Icon name='chevron-right' />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    // Change Location
    changeLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        gap: 10,
        backgroundColor: '#BA2829'
    },

    // Container
    container: {
        padding: 15,
        backgroundColor: mainStyles.mainColors.background,
        flex: 1
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
        marginHorizontal: -5,
        marginBottom: 20, 
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
});