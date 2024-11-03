import { View, Text } from 'react-native';
import { signOut } from "@firebase/auth";
import { auth } from '../../firebase/config';
import useUserStore from '../../store/user';

export interface ProfileScreenProps {
}

export default function ProfileScreen (props: ProfileScreenProps) {
    const { user, setUser } = useUserStore.getState();

    async function handleLogout(){
        try {
            await signOut(auth);
            console.log("Usuário deslogado com sucesso!");
            setUser(null);
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    }

    return (
      <View>
         <Text>ProfileScreen...</Text>
      </View>
    );
}