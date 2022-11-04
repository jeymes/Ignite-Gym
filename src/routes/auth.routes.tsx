import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack'
import { Signin } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';


type AuthRoutes ={
    signIn: undefined;
    signUp: undefined;
}

export type AuthNavigationRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const {Navigator, Screen} = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes(){
    return(
        <Navigator screenOptions={{ headerShown: false}}>
            <Screen
            name="signIn"
            component={Signin}
            />
            <Screen
            name="signUp"
            component={SignUp}
            />
        </Navigator>
    )
}