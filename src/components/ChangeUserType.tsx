import { Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { mainStyles } from '../utils/mainStyles';

export interface ChangeUserTypeProps {
    userType: string,
    setUserType: Dispatch<SetStateAction<string>>,
    style?: object
}

export function ChangeUserType (props: ChangeUserTypeProps) {
    const { userType, setUserType, style } = props;

    return (
        <View style={[styles.changeUserButtonsContainer, style && style]}>
            <View style={[styles.changeUserButtons, userType === 'CLIENT' && styles.changeUserButtonsSelected]}>
                <TouchableOpacity onPressIn={() => setUserType('CLIENT')}>
                    <Text style={styles.buttonsText}>CLIENTE</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.changeUserButtons, userType === 'RETAILER' && styles.changeUserButtonsSelected]}>
                <TouchableOpacity onPressIn={() => setUserType('RETAILER')}>
                    <Text style={styles.buttonsText}>VAREJISTA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    changeUserButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40,
    },
    changeUserButtons:{
        backgroundColor: mainStyles.mainColors.transparentColor,
        padding: 10,
        borderRadius: 5,
        flex: 1
    },
    changeUserButtonsSelected:{
        backgroundColor: mainStyles.mainColors.primaryColor,
    },
    buttonsText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});