import { View, Text, Button } from 'react-native'
import useUserStore from '../../../store/user'
import { router } from 'expo-router';

interface RetailerHomeScreenProps{
}

export default function RetailerHomeScreen(props: RetailerHomeScreenProps) {
    const {user, setUser, logout} = useUserStore();

    function handleLogout(){
        logout();
        router.replace("/");
    }

    return (
        <View>
            <Text>RetailerHomeScreen</Text>
            <Button title='Clique aqui para deslogar!' onPress={handleLogout}/>
        </View>
    )
}