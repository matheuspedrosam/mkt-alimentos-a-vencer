import { View, StyleSheet } from 'react-native';
import { Logo } from '../components/Logo';
import { useEffect } from 'react';
import { router } from 'expo-router';

export interface FirstLoadingScreenProps {
}

export default function FirstLoadingScreen (props: FirstLoadingScreenProps) {
    useEffect(() => {
        setTimeout(() => {
            router.replace('/Login/LoginScreen')
        }, 2000)
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
