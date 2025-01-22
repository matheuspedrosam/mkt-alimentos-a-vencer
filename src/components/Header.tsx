import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { mainStyles } from '../utils/mainStyles';
import { Icon } from '@rneui/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Fragment } from 'react';

export interface HeaderProps {
    backHeader?: boolean
}

export function Header (props: HeaderProps) {
    const { backHeader } = props;
    const insets = useSafeAreaInsets();
    const statusBarHeight = StatusBar.currentHeight

    return (
        <View style={[styles.header, Platform.OS === 'android' ? {paddingTop: (15 + statusBarHeight)} : {paddingTop: (5 + insets.top)}]}>
            {!backHeader &&
                <Fragment>
                    <View style={styles.logoContainer}>
                        <Image style={{width: 50, height: 50}} source={require("../../assets/white-logo.png")} />
                        <View>
                            <Text style={styles.headerTitle}>DESCONTO</Text>
                            <View style={styles.headerSubTitleContainer}>
                                <Text style={styles.headerSubTitle}>SUSTENTÁVEL</Text>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <Circle key={item} />)}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push("Profile/ProfileScreen")}>
                        <Icon name='account-circle' color='white' size={36}/>
                    </TouchableOpacity>
                </Fragment>
            }
            {backHeader && 
                <Fragment>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backArrowContainer}>
                        <Icon name='arrow-back' color='white' size={28}/>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>Voltar</Text>
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image style={{width: 50, height: 50}} source={require("../../assets/white-logo.png")} />
                    </View>
                </Fragment>
            }
        </View>
    );
}

function Circle(){
    return (<View style={styles.circle}></View>)
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: mainStyles.mainColors.primaryColor,
        padding: 15,
        paddingTop: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 4,
    },

    // LogoContainer
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: .5 ,
    },
    headerSubTitleContainer:{
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 3
    },
    headerSubTitle: {
        color: 'white',
        fontSize: 12,
    },
    circle: {
        backgroundColor: 'white',
        height: 5,
        width: 5,
        borderRadius: 30,
    },

    // backHeader
    backArrowContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
});
