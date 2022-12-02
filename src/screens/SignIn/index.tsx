import {VStack, Image, Text, Center, Heading, ScrollView, useToast} from 'native-base';

import { Controller, useForm } from 'react-hook-form';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import {AuthNavigationRoutesProps} from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormData ={
    email: string;
    password: string;
}

const signUpSchema = yup.object({
    email: yup.string().required('Informe um e-mail').email('E-mail inválido.'),
    password: yup.string().required('Informe uma senha').min(6, "A senha deve ter pelo menos 6 dígitos."),
});

export function Signin(){

    const [isLoading, setIsLoading] = useState(false)

    const { signIn } = useAuth();

    const { control, handleSubmit, formState: { errors} } = useForm<FormData>({
        resolver: yupResolver(signUpSchema)
    });

    const toash = useToast();

    async function handleSignIn({password, email}: FormData){
        try {
            setIsLoading(true);
       await signIn(email, password);
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível entrar. Tenta novamente mais tarde.';
            
            setIsLoading(false);
            
            toash.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
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
            rules={{ required: 'Informe o e-mail' }}
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
            rules={{ required: 'Informe a senha' }}
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
            onPress={handleSubmit(handleSignIn)}
            title="Acessar" 
            isLoading={isLoading}
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