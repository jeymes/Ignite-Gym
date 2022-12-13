import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast} from 'native-base'
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup'

import { Controller, useForm  } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

// upload image
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';


const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    conrfirm_password: string;
}

const profileSchema = yup.object({
    name: yup
    .string()
    .required('Informe o nome.'),

    password: yup
    .string().min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),

    conrfirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
        is: (Field: any) => Field,
        then: yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value : null)
    })

})

export function Profile(){

    const [isUpdating, setIsUpdating] = useState(false);

    const { user, updateUserProfile } = useAuth();

    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();
    const {control, handleSubmit, formState: { errors }} = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema)
    });


    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
                });
        
                if (photoSelected.cancelled){
                    return;
                }

                if (photoSelected.uri){
                    const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);
                
                    if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 2){
                        return toast.show({
                            title:"Essa imagem é muito grande. Escolha uma de até 2MB",
                            placement: 'top',
                            bgColor: "red.500"
                        })
                    }
                }

                const fileExtension = photoSelected.uri.split('.').pop();

                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoSelected.uri,
                    type: `${photoSelected.type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

               const avatarUpdatedResponse = await api.patch('users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    title: 'Foto atualizada!',
                    placement: 'top',
                    bgColor: 'green.500'
                })

        
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false);
        }

        
    }

    async function handleProfileUpdate(data: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdate = user;
            userUpdate.name = data.name;

            await api.put('/users', data);

            await updateUserProfile(userUpdate);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsUpdating(false);
        }
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{paddingBottom: 36}}>
                <Center mt={6} px={10}>
                    {
                    photoIsLoading ?

                    <Skeleton
                size={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
                />
                :
                <UserPhoto
                source={
                    user.avatar
                    ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} 
                    : defaultUserPhotoImg}
            alt="Foto do usuario"
            size={PHOTO_SIZE}
            />
                    }
                
            <TouchableOpacity onPress={handleUserPhotoSelect} >
                <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                    Alterar foto
                </Text>
            </TouchableOpacity>

            <Controller 
              control={control}
              name="name"
              render={({ field: {value, onChange} }) => (
                <Input
                   placeholder='Nome'
                   bg="gray.600"
                   onChangeText={onChange}
                   value={value}
                   errorMessage={errors.name?.message}
            />
              ) }
            />
            <Controller 
              control={control}
              name="email"
              render={({ field: {value, onChange} }) => (
                <Input
                bg="gray.600"
                placeholder='Jsvpn2017@gmail.com'
                isDisabled
                onChangeText={onChange}
                value={value}
            />
              ) }
            />

                <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2} alignSelf="flex-start" mt={12}>
                    Alterar senha
                </Heading>

                <Controller 
              control={control}
              name="old_password"
              render={({ field: {onChange} }) => (
                <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                />
              ) }
            />
            
            <Controller 
              control={control}
              name="password"
              render={({ field: {onChange} }) => (
                <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                />
              ) }
            />
            
            <Controller 
              control={control}
              name="conrfirm_password"
              render={({ field: {onChange} }) => (
                <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.conrfirm_password?.message}
                />
              ) }
            />

               <Button
               title="Atualizar"
               mt={4}
               onPress={handleSubmit(handleProfileUpdate)}
               isLoading={isUpdating}
               />
            </Center>
            
            </ScrollView>
            
        </VStack>
    )
}