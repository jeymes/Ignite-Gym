import { Heading, HStack, Image, VStack, Text, Icon } from "native-base";
import {TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons"

type Props = TouchableOpacityProps & {
name: undefined
};

export function ExerciseCard({name, ...rest}: Props){
    return(
        <TouchableOpacity {...rest}>
            <HStack bg="gray.500" alignItems="center" p={4} pr={4} rounded="md" mb={3} >
                <Image
                source={{uri: "https://blog.lionfitness.com.br/wp-content/uploads/2019/01/Blog-75-1.jpg"}}
                alt="Remada"
                w={16}
                h={16}
                rounded="md"
                mr={4}
                resizeMode="center"
                />
                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" fontFamily="heading">
                        {name}
                    </Heading>

                    <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
                        3 séries x 12 repetições
                    </Text>
                </VStack>
                <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
            </HStack>
        </TouchableOpacity>
    );
}