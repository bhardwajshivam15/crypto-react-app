import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { server } from '..';
import { Container, Heading, VStack ,RadioGroup,Radio} from '@chakra-ui/react';
import {HStack,Image,Text,Button} from '@chakra-ui/react'
import Loader from './Loader'
import ErrorComponent from './ErrorComponent';
import { Link } from 'react-router-dom';

function Coins() {
  const [coins,setcoins] = useState([]);
  const [loading,setloading] = useState(true);
  const [error,seterror] = useState(false);
  const [page,setpage] = useState(1);
  const [currency,setcurrency] = useState("inr");
  const currencySymbol = currency==="inr"?"₹":currency==="eur"?"€":"$";
  const changePage = (page) =>{
    setpage(page);
    setloading(true);
  }
  const btns = new Array(132).fill(1);
  useEffect(() =>{
    const fetchcoins = async()=>{
      try{
        const {data} = await axios.get(server+'/coins/markets?vs_currency='+currency+"&page="+page);
        setcoins(data);
        setloading(false);
      }
      catch(e){
       seterror(true);
       setloading(false);
      }
    }
    fetchcoins();
  },[currency,page]);
  if(error) return  <ErrorComponent message={"Error while fetching coins"}/>

return (
  <Container maxW={"container.x1"}>
    {loading?(<Loader/>):
    (<>
    <RadioGroup p={"8"} value={currency} onChange={setcurrency}>
      <HStack spacing={"4"}>
        <Radio value={"inr"}>INR</Radio>
        <Radio value={"usd"}>USD</Radio>
        <Radio value={"eur"}>EUR</Radio>
      </HStack>
    </RadioGroup>
    <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
      {
       coins.map((i)=> (
        <CoinCard 
        id = {i.id}
        key={i.id}
        name={i.name}
        price={i.current_price}
        img = {i.image}
        symbol={i.symbol}
        currencySymbol={currencySymbol}
        />
        )
        )
      }
    </HStack>
    <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {btns.map((item, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
    </>)
    }
  </Container>
)
}

const CoinCard  = ({name,img,symbol,id,price,currencySymbol='₹'})=>{
return <Link to={'/coin/'+id}>
 <VStack w={"52"} shadow={"lg"} p={"8"} borderRadius={"lg"} transition={"all 0.3s"} m={"4"} css={{
  "&:hover":{
    transform:"scale(1.1)"
  }
 }}>
  <Image src={img} w={"10"} height={"10"} objectFit={"contain"} alt={"Exchange"}/>
 <Heading size={"md"} noOfLines={1}>{symbol}</Heading>
 <Text noOfLines={1}>{name}</Text>
 <Text noOfLines={1}>{price?currencySymbol+price:"NA"}</Text>
 </VStack>
</Link>
}

export default Coins

