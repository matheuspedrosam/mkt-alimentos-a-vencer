import { Icon } from '@rneui/base';
import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import textAbbr from '../utils/textAbbr';

export interface ChangeLocationProps {
    location: any
    onClick: () => void
}

export function ChangeLocation (props: ChangeLocationProps) {
    const insets = useSafeAreaInsets();
    const { location, onClick } = props;

    return (
        <View style={[styles.changeLocationContainer, Platform.OS === 'ios' && {paddingBottom: (insets.bottom)}]} onTouchEnd={onClick}>
            <Icon name='location-on' color={'white'}/>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{location ? textAbbr(location.description, 26) : "Pajuçara, Maceió"}</Text>
            <Icon name='keyboard-arrow-down' color={'white'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    // Change Location
    changeLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        gap: 10,
        backgroundColor: '#BA2829'
    },
});