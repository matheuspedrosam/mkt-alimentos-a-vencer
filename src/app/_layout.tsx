import { Stack, useGlobalSearchParams } from "expo-router";
import { Fragment } from "react";
import { mainStyles } from "../utils/mainStyles";
import { StyleSheet } from "react-native";

export default function Layout(){
    const params: any = useGlobalSearchParams();

  return (
    <Fragment>
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' }, // Cor de fundo global para todas as telas do Stack
                statusBarTranslucent: true,
                statusBarBackgroundColor: mainStyles.mainColors.primaryColor,
            }}>

            {/* Index && NotAuth Routes */}
            <Stack.Screen name='index' />
            <Stack.Screen name='Register/RegisterScreen' />
            <Stack.Screen name='Login/LoginScreen' />
            <Stack.Screen name='ForgotPassword/ForgotPasswordScreen' />

            {/* Auth Routes */}
            {/* Client */}
            <Stack.Screen name='Home/Client/ClientHomeScreen' />
            <Stack.Screen name='Product/ProductScreen' />

            {/* Retailer */}
            <Stack.Screen name='Home/Retailer/RetailerHomeScreen' />

            {/* Both */}
            <Stack.Screen name='Profile/ProfileScreen' />
            <Stack.Screen name='EditProfile/EditProfileScreen' />
        </Stack>
    </Fragment>
  )
}

const styles = StyleSheet.create({
    mainHeader: {
        backgroundColor: mainStyles.mainColors.primaryColor,
    }
});
