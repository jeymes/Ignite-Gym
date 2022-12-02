import { StatusBar, Text, View } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import {NativeBaseProvider} from 'native-base';
import { Loading } from '@components/Loading';
import {THEME} from './src/theme';
import { Routes } from '@routes/index';

import { AuthContextProvider } from '@contexts/AuthContext';

export default function App() {
 const [fontsLoaded] =  useFonts({ Roboto_400Regular, Roboto_700Bold})

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent
      />
     <AuthContextProvider>
     {fontsLoaded ?  <Routes/> : <Loading/>}
     </AuthContextProvider>

    </NativeBaseProvider>
  );
}
