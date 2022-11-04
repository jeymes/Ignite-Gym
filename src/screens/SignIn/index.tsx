import {VStack, Image, Text, Center, Heading, ScrollView} from 'native-base';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import {AuthNavigationRoutesProps} from '@routes/auth.routes'

import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormDataProps ={
    email: string;
    password: string;
}

const signUpSchema = yup.object({
    email: yup.string().required('Informe um e-mail').email('E-mail inválido.'),
    password: yup.string().required('Informe uma senha').min(6, "A senha deve ter pelo menos 6 dígitos."),
});

export function Signin(){

    const { control, handleSubmit, formState: { errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    function handleSignUp({password, email}: FormDataProps){

    }

    const navigation = useNavigation<AuthNavigationRoutesProps>();

    function handleNewAccount(){
        navigation.navigate('signUp')
    }

    return(
        <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
        <VStack px={10} flex={1} pb={16}>
            <Image
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="Pessoas treinando"
            resizeMode='contain'
            position="absolute"
            />

            <Center my={24}>
            <LogoSvg/>

            <Text color="gray.100" fontSize="sm">
                Treine sua mente e o seu corpo
            </Text>
            </Center>

            <Center>
            <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                Acesse sua conta
            </Heading>

            <Controller
            control={control}
            name="email"
            render={({ field: {onChange, value} }) => (
                <Input 
            keyboardType='email-address'
            placeholder='Email' 
            autoCapitalize='none'
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
            />
            )}
            />

            <Controller
            control={control}
            name="password"
            render={({ field: {onChange, value} }) => (
                <Input 
            placeholder='Senha' 
            secureTextEntry
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
            />
            )}
            />

            <Button
            onPress={handleSubmit(handleSignUp)}
            title="Acessar" 
            />

            </Center>

            <Center mt={24}>
            <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                Ainda não tem acesso?
            </Text>
           

            <Button
            title="Criar Conta"
            variant="outline"
            onPress={handleNewAccount}
            />
             </Center>

        </VStack>
        </ScrollView>
    );
}