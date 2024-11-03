import { Stack, useGlobalSearchParams } from "expo-router";
import { Fragment } from "react";
import { mainStyles } from "../utils/mainStyles";
import { StyleSheet } from "react-native";

export default function Layout(){
    const params: any = useGlobalSearchParams();

  return (
    <Fragment>
        <Stack>

            {/* Index && NotAuth Routes */}
            <Stack.Screen name='index' options={{
                headerShown: false
            }} />

            <Stack.Screen name='Register/RegisterScreen' options={{
                headerShown: false
            }} />

            <Stack.Screen name='Login/LoginScreen' options={{
                headerShown: false
            }} />

            <Stack.Screen name='ForgotPassword/ForgotPasswordScreen' options={{
                headerShown: false
            }} />

            {/* Auth Routes */}
            {/* Client */}
            <Stack.Screen name='Home/Client/ClientHomeScreen' options={{
                title: "Home | Cliente",
                headerStyle: styles.mainHeader,
                headerTitleStyle: {color: 'white'},
            }} />

            <Stack.Screen name='Product/ProductScreen' options={{
                title: "Produto | Cliente",
                headerStyle: styles.mainHeader,
                headerTitleStyle: {color: 'white'},
                headerTintColor: 'white'
            }} />

            {/* Retailer */}
            <Stack.Screen name='Home/Retailer/RetailerHomeScreen' options={{
                title: "Home | Varejista",
                headerStyle: styles.mainHeader,
                headerTitleStyle: {color: 'white'}
            }} />


            {/* Both */}
        </Stack>
    </Fragment>
  )
}

const styles = StyleSheet.create({
    mainHeader: {
        backgroundColor: mainStyles.mainColors.primaryColor,
    }
});
