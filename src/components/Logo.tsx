import { View, Text, StyleSheet, Image } from 'react-native';
import { mainStyles } from '../utils/mainStyles';

export interface LogoProps {
    logoWidth?: number,
    logoHeight?: number,
    titleFontSize?: number,
    subTitleFontSize?: number,
    circleSize?: number
}

export function Logo (props: LogoProps) {
    const { logoWidth, logoHeight, titleFontSize, subTitleFontSize, circleSize } = props;

    return (
        <View>
            <Image 
                source={require('../../assets/red-logo.png')}
                style={{width: logoWidth || 200, height: logoHeight || 200, margin: 'auto'}}/>
            <Text style={{fontSize: titleFontSize || 32, fontWeight: 'bold', textAlign: 'center'}}>DESCONTO</Text>
            <View style={styles.subtitleContainer}>
                <View style={[styles.redCircle, {width: circleSize || 10, height: circleSize || 10}]}/>
                <Text style={{fontSize: subTitleFontSize || 16}}>SUSTENTÁVEL</Text>
                <View style={[styles.redCircle, {width: circleSize || 10, height: circleSize || 10}]}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subtitleContainer: {
        justifyContent: 'center',
        alignItems: 'center', 
        flexDirection: 'row', 
        gap: 10
    },
    redCircle: {
        backgroundColor: mainStyles.mainColors.primaryColor,
        borderRadius: 100,
    }
});