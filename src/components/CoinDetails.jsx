import { Container,Box ,Button,HStack,Radio,RadioGroup,VStack,Text,Image, StatLabel, StatNumber,Stat, StatHelpText,StatArrow, Badge} from '@chakra-ui/react'
import React from 'react'
import {Progress} from '@chakra-ui/react'
import Chart from './Chart';

import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '..';
import Loader from './Loader';
import axios from 'axios';
import ErrorComponent from './ErrorComponent';

function CoinDetails() {
  const [coins,setcoins] = useState([]);
  const [loading,setloading] = useState(true);
  const [error,seterror] = useState(false);
  const [page,setpage] = useState(1);
  const [currency,setcurrency] = useState("inr");
  const [days,setdays] = useState('24h');
  const [chartarr,setchartarr] = useState([]);
  const currencySymbol = currency==="inr"?"₹":currency==="eur"?"€":"$";
  
  const params = useParams();
  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setdays("24h");
        setloading(true);
        break;
      case "7d":
        setdays("7d");
        setloading(true);
        break;
      case "14d":
        setdays("14d");
        setloading(true);
        break;
      case "30d":
        setdays("30d");
        setloading(true);
        break;
      case "60d":
        setdays("60d");
        setloading(true);
        break;
      case "200d":
        setdays("200d");
        setloading(true);
        break;
      case "1y":
        setdays("365d");
        setloading(true);
        break;
      case "max":
        setdays("max");
        setloading(true);
        break;

      default:
        setdays("24h");
        setloading(true);
        break;
    }
  };
  useEffect(() =>{
    const fetchcoin = async()=>{
      try{
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
          );
          setcoins(data);
          setchartarr(chartData.prices);
          setloading(false);
      }
      catch(e){
       seterror(true);
       setloading(false);
      }
    }
    fetchcoin();
  },[params.id,days,currency]);
  if(error) return  <ErrorComponent message={"Error while fetching Coin Details"}/>
  return (
    <Container maxW={"container.xl"}>
     {
      loading?<Loader/> : (
        <>
         <Box borderWidth={1} width={"full"}>
           <Chart currency={currencySymbol} arr={chartarr} days={days}/>
         </Box>
         <HStack p="4" overflowX={"auto"}>
            {btns.map((i) => (
              <Button
                disabled={days === i}
                key={i}
                onClick={() => switchChartStats(i)}
              >
                {i}
              </Button>
            ))}
          </HStack>
    <RadioGroup p={"8"} value={currency} onChange={setcurrency}>
      <HStack spacing={"4"}>
        <Radio value={"inr"}>INR</Radio>
        <Radio value={"usd"}>USD</Radio>
        <Radio value={"eur"}>EUR</Radio>
      </HStack>
    </RadioGroup>
    <VStack spacing={"4"} p="16" alignItems={"flex-start"}>
    <Text fontSize={"small"} alignSelf="center" opacity={0.7}>
    last Updated on {Date(coins.market_data.last_updated).split("G")[0]}
    </Text>
    <Image src={coins.image.large} w={"16"} height={"16"} objectFit={"contain"}/>
    <Stat>
      <StatLabel>{coins.name}</StatLabel>
      <StatNumber>{currencySymbol}{coins.market_data.current_price[currency]}</StatNumber>
      <StatHelpText>
        <StatArrow type={coins.market_data.price_change_percentage_24h<=0?"decrease":"increase"}/>
        {coins.market_data.price_change_percentage_24h}%
      </StatHelpText>
    </Stat>
    <Badge fontSize={'2xl'} bgColor={"blackAlpha.800"} color={'white'}>
      {"#"+coins.market_cap_rank}
    </Badge>
    <CustomBar high={`${coins.market_data.high_24h[currency]}`} low={`${coins.market_data.low_24h[currency]}`} />
    <Box w={'full'} p='4'>
      <Item title={'Max Supply'} value={coins.market_data.max_supply}/>
      <Item title={'Circulating Supply'} value={coins.market_data.circulating_supply}/>
      <Item title={'Market Cap'} value={`${currencySymbol}${coins.market_data.market_cap[currency]}`}/>
      <Item title={'All Time Low'} value={`${currencySymbol}${coins.market_data.atl[currency]}`}/>
      <Item title={'All Time High'} value={`${currencySymbol}${coins.market_data.ath[currency]}`}/>
    </Box>
    </VStack>
        </>
      )
     }
    </Container>
  )
}
const Item = ({title,value})=>(
  <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>{title}</Text>
    <Text fontFamily={'Bebas Neue'}>{value}</Text>
  </HStack>
)
const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);
export default CoinDetails

