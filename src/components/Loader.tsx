import { View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface LoaderProps {
    containerStyle?: ViewStyle
}

export default function Loader(props: LoaderProps) {
    const { containerStyle } = props;
    return (
        <View style={[styles.loaderContainer, containerStyle && containerStyle]}>
            <ActivityIndicator size={32}/>
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});