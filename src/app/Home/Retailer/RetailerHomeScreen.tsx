import { View, Text, Button } from 'react-native'

interface RetailerHomeScreenProps{
}

export default function RetailerHomeScreen(props: RetailerHomeScreenProps) {

    return (
        <View>
            <Text>RetailerHomeScreen</Text>
            <Button title='Clique aqui para deslogar!' />
        </View>
    )
}