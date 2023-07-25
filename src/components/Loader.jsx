import { VStack,Box,Spinner } from '@chakra-ui/react'
import React from 'react'

function Loader() {
  return(
    <VStack h="90vh" justifyContent={"center"}>
       <Box transform={"scale(3)"}>
       <Spinner size={"xl"} color={"blackAlpha.900"}/>
       </Box>
    </VStack>
  )
};

export default Loader