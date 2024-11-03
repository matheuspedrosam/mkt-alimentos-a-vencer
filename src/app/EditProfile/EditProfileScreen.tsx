import { Fragment, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { Header } from '../../components/Header';
import { Icon } from '@rneui/base';
import useUserStore from '../../store/user';
import { mainStyles } from '../../utils/mainStyles';
import { router } from 'expo-router';

export interface EditProfileScreenProps {
}

export default function EditProfileScreen (props: EditProfileScreenProps) {
    const { height } = useWindowDimensions();
    const { user, setUser } = useUserStore.getState();

    const [name, setName] = useState("");

    function handleUpdateProfile(){

    }

    return (
        <Fragment>
            <Header backHeader={true}/>
            <ScrollView>
                <View style={{minHeight: height - 200, padding: 15, justifyContent: 'space-between'}}>
                    <View style={styles.form}>
                        <View>
                            <View style={styles.userPhotoContainer}>
                                <Image
                                    style={styles.userImg}
                                    source={require("../../../assets/userIcon.jpg")}/>
                            </View>
                            {user.userType == "RETAILER" &&
                                <View>
                                </View>
                            }
                        </View>
                        
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                        <TextInput
                            style={styles.input}
                            placeholder='NOME COMPLETO'
                            placeholderTextColor={mainStyles.mainColors.primaryColor}
                            onChangeText={(text) => setName(text)}
                            value={name}/>
                    </View>

                    <View style={styles.btnsContainer}>
                        <TouchableOpacity 
                            style={[styles.button, {backgroundColor: 'white'}]} 
                            onPress={() => router.back()}>
                            <Text style={{color: mainStyles.mainColors.primaryColor, fontWeight: 'bold'}}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
      </Fragment>
    )
}

const styles = StyleSheet.create({
    // userPhotoContainer
    userPhotoContainer: {
        marginBottom: 40,
    },
    userImg: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },

    // Form
    form: {
        marginBottom: 100,
    },
    input: {
        backgroundColor: mainStyles.mainColors.transparentColor,
        padding: 15,
        borderRadius: 5,
        borderColor: mainStyles.mainColors.primaryColor,
        borderWidth: 1,
        textDecorationColor: mainStyles.mainColors.primaryColor,
        marginBottom: 10
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