import { Stack, useGlobalSearchParams } from "expo-router";
import { Fragment } from "react";

export default function Layout(){
    const params: any = useGlobalSearchParams();

  return (
    <Fragment>
        <Stack>
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
        </Stack>
    </Fragment>
  )
}
