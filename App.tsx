import { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Updates from 'expo-updates';

export interface AppProps {
}

export function App (props: AppProps) {
  async function onFetchUpdateAsync() {
    try{
      const update = await Updates.checkForUpdateAsync();

      if(update.isAvailable){
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error){
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  })

  return (
    <View>
        <Text>App</Text>
    </View>
  );
}
