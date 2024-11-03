import { View, Text, Button, ScrollView, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from "@firebase/auth";
import { auth } from '../../firebase/config';
import useUserStore from '../../store/user';
import { Header } from '../../components/Header';
import { Fragment } from 'react';
import { mainStyles } from '../../utils/mainStyles';
import { Image } from 'react-native';
import { Icon } from '@rneui/base';
import { router } from 'expo-router';

export interface ProfileScreenProps {
}

export default function ProfileScreen (props: ProfileScreenProps) {
    const { user, setUser } = useUserStore.getState();
    const { height } = useWindowDimensions();

    async function handleLogout(){
        try {
            await signOut(auth);
            setUser(null);
            router.replace("Login/LoginScreen");
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 200, padding: 15, justifyContent: 'space-between'}}>
                    <View>
                        <View style={styles.userPhotoContainer}>
                            <Image
                                style={styles.userImg}
                                source={require("../../../assets/userIcon.jpg")}/>
                            <Text style={{fontWeight: 'bold', color: mainStyles.mainColors.primaryColor}}>UserName</Text>
                        </View>
                        {user.userType == "RETAILER" &&
                            <View style={styles.userLocationContainer}>
                                <View style={styles.userLocationTitleContainer}>
                                    <Icon name='location-on' color={mainStyles.mainColors.primaryColor}/>
                                    <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Assaí Atacadista</Text>
                                </View>
                                <Text style={styles.userLocationAdress}>
                                    Menino Marcelo, s/n - Serraria, Maceió - AL, 57046-000
                                </Text>
                            </View>
                        }
                        <View style={styles.userLocationContainer}>
                            <View style={styles.userLocationTitleContainer}>
                                <Icon name='email' color={mainStyles.mainColors.primaryColor}/>
                                <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>E-mail</Text>
                            </View>
                            <Text style={styles.userLocationAdress}>
                                matheuspedrosa2002@gmail.com
                            </Text>
                        </View>
                    </View>

                    <View style={styles.btnsContainer}>
                        <TouchableOpacity 
                            style={[styles.button, {backgroundColor: 'white'}]} 
                            onPress={() => router.push("EditProfile/EditProfileScreen")}>
                            <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Editar perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleLogout}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Sair da conta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
      </Fragment>
    );
}

const styles = StyleSheet.create({
    // userPhotoContainer
    userPhotoContainer: {
        marginBottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    userImg: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },

    // userLocationContainer
    userLocationContainer: {
        marginBottom: 40
    },
    userLocationTitleContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    userLocationAdress: {
        marginLeft: 30,
        color: 'gray',
    },

    // btnsContainer
    btnsContainer: {
        // marginTop: 100
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