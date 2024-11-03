import { Icon } from '@rneui/base';
import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ChangeLocationProps {
}

export function ChangeLocation (props: ChangeLocationProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.changeLocationContainer, Platform.OS === 'ios' && {paddingBottom: (insets.bottom)}]}>
            <Icon name='location-on' color={'white'}/>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Testeee, Maceió</Text>
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