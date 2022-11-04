import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast} from 'native-base'
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

// upload image
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const PHOTO_SIZE = 33;

export function Profile(){

    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const [userPhoto, setUserPhoto] = useState('https://github.com/jeymes.png')

    const toast = useToast();

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


                setUserPhoto(photoSelected.uri);
                }
        
        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false);
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
            source={{uri: userPhoto}}
            alt="Foto do usuario"
            size={PHOTO_SIZE}
            />
                    }
                
            <TouchableOpacity onPress={handleUserPhotoSelect} >
                <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                    Alterar foto
                </Text>
            </TouchableOpacity>

            <Input
            placeholder='Nome'
            bg="gray.600"
            />
            <Input
            bg="gray.600"
            placeholder='Jsvpn2017@gmail.com'
            isDisabled
            />

                <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2} alignSelf="flex-start" mt={12}>
                    Alterar senha
                </Heading>
                <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                />
                <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                />
                <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                />

               <Button
               title="Atualizar"
               mt={4}
               />
            </Center>
            
            </ScrollView>
            
        </VStack>
    )
}