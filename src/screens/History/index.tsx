import { HistoryCard } from '@components/HistoryCard';
import { Loading } from '@components/Loading';
import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, Text, Heading, SectionList, useToast, Center} from 'native-base';
import { useCallback, useState } from 'react';


export function History(){

    const [isLoading, setIsLoading] = useState(true);

    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

    const toast = useToast();

    const {refreshedToken} = useAuth();

    async function fetchHistory() {
        try {
            setIsLoading(true);

            const response = await api.get('/history')
            setExercises(response.data);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, [refreshedToken]))

    return(
        <VStack flex={1}>
           <ScreenHeader title="Histórico de Exercícios"/>


          {  
          
          isLoading ? <Loading/> : (
            exercises?.length > 0  ? 
            <SectionList
            sections={exercises}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
            <HistoryCard data={item} />
          
            )}
            renderSectionHeader={({ section}) => (
             <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                 {section.title}
             </Heading>
            )}
            px={8}
            contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
            showsVerticalScrollIndicator={false}
            />
            :  
            <Center flex={1}>
                <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda.
            {'\n'}
            Vamos fazer exercícios hoje?
        </Text>
        </Center>
          )

         }
           
        </VStack>
    )
}