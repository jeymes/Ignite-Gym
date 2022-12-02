import {VStack, Image, Text, Center, Heading, ScrollView, useToast} from 'native-base';
import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

type FormDataProps ={
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe um nome.'),
    email: yup.string().required('Informe um e-mail').email('E-mail inválido.'),
    password: yup.string().required('Informe uma senha').min(6, "A senha deve ter pelo menos 6 dígitos."),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.')
});

export function SignUp(){

    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();

    const toash = useToast();

    const { control, handleSubmit, formState: { errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();

    function handleGoback(){
        navigation.goBack();
    }

    async function handleSignUp({name, password, email}: FormDataProps){
       try {
        setIsLoading(true);

        await api.post('/users', { name, email, password });

        await signIn(email, password);

       } catch (error) {
        setIsLoading(false);

        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível criar a conta, Tente novamente mais tarde.'

        toash.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
        })
       }
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
                Crie sua conta
            </Heading>

            <Controller
            control={control}
            name="name"
            render={({ field: {onChange, value} }) => (
                <Input 
            placeholder='Nome'
            onChangeText={onChange}
            value={value}
            errorMessage={errors.name?.message}
            />
            )}
            />

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

            <Controller
            control={control}
            name="password_confirm"
            render={({ field: {onChange, value} }) => (
                <Input 
            placeholder='Confirme Senha'
            secureTextEntry
            onChangeText={onChange}
            value={value}
            onSubmitEditing={handleSubmit(handleSignUp)}
            returnKeyType="send"
            errorMessage={errors.password_confirm?.message}
            />
            )}
            />

            <Button
            onPress={handleSubmit(handleSignUp)}
            title="Criar e acessar" 
            isLoading={isLoading}
            />

            </Center>

            
            <Button
            title="Voltar para o login"
            variant="outline"
            mt={24}
            onPress={handleGoback}
            />

        </VStack>
        </ScrollView>
    );
}