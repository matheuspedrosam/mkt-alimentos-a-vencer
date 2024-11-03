import { View, StyleSheet } from 'react-native';
import { Logo } from '../components/Logo';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { auth, db, doc } from '../firebase/config';
import { onAuthStateChanged } from '@firebase/auth';
import useUserStore from '../store/user';
import { getDoc } from 'firebase/firestore';

export interface FirstLoadingScreenProps {
}

export default function FirstLoadingScreen (props: FirstLoadingScreenProps) {
    const {user, setUser} = useUserStore.getState();

    useEffect(() => {
        onAuthStateChanged(auth, (userCredentials) => {
            setTimeout(() => {
                if (userCredentials) {
                    setUser(userCredentials);
                    const docRef = doc(db, 'users', userCredentials.uid);
                    getDoc(docRef).then((docSnap) => {
                        if(docSnap.data().userType == 'CLIENT'){
                            router.replace("Home/Client/ClientHomeScreen");
                        } else if(docSnap.data().userType == 'RETAILER'){
                            router.replace("Home/Retailer/RetailerHomeScreen");
                        }
                    })
                } else {
                    router.replace('/Login/LoginScreen');
                }
            }, 1500)
        })
    }, [])

    return (
      <View style={styles.container}>
            <Logo 
                logoWidth={200}
                logoHeight={200}
                titleFontSize={32}
                subTitleFontSize={16}/>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
