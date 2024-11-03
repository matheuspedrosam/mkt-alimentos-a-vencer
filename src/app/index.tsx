import { View, StyleSheet } from 'react-native';
import { Logo } from '../components/Logo';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { auth, db, doc } from '../firebase/config';
import { onAuthStateChanged } from '@firebase/auth';
import useUserStore from '../store/user';
import { getDoc } from 'firebase/firestore';
import { mainStyles } from '../utils/mainStyles';
import LottieView from 'lottie-react-native';

export interface FirstLoadingScreenProps {
}

export default function FirstLoadingScreen (props: FirstLoadingScreenProps) {
    const {user, setUser} = useUserStore.getState();
    const [animationFinished, setAnimationFinish] = useState(false);

    function onAnimationFinish(){
        setAnimationFinish(true);
        setTimeout(() => {
            onAuthStateChanged(auth, (userCredentials) => {
                if (userCredentials) {
                    const docRef = doc(db, 'users', userCredentials.uid);
                    getDoc(docRef).then((docSnap) => {
                        const user = docSnap.data();
                        setUser({id: userCredentials.uid, ...user});
                        if(docSnap.data().userType == 'CLIENT'){
                            router.replace("Home/Client/ClientHomeScreen");
                        } else if(docSnap.data().userType == 'RETAILER'){
                            router.replace("Home/Retailer/RetailerHomeScreen");
                        }
                    })
                } else {
                    router.replace('/Login/LoginScreen');
                }
            })
        }, 500)
    }

    return (
      <View style={styles.container}>
            {!animationFinished && 
                <LottieView
                    style={{width: 250, height: 250}}
                    source={require('../../assets/lottie.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={onAnimationFinish}
                />
            }

            {animationFinished && 
                <Logo
                    logoWidth={200}
                    logoHeight={200}
                    titleFontSize={32}
                    subTitleFontSize={16}/>
            }
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: mainStyles.mainColors.background
    }
});
