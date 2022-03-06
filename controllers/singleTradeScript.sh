TIMEFORMAT=%R  


token=$1
type=$2
side=$3
product_id=$4
quantity=$5



if [ $type = "MKT" ]
then
MKTTime=`{ time result=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
               --header "Authorization: Bearer $token" \
               --form "type=$type" \
               --form "side=$side" \
               --form "product_id=$product_id" \
               --form "quantity=$quantity");
                echo $result
} 2>&1`

echo $MKTTime 
elif [ $type = "FOK" ]
then
FOKTime=`{ time quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity")

          price=$(echo $quote | jq -r ".price")
          
          
result=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
           --header "Authorization: Bearer $token" \
           --form "type=$type" \
           --form "side=$side" \
           --form "product_id=$product_id" \
           --form "quantity=$quantity" \
           --form "price=$price");
            echo $result

           } 2>&1`
          
echo $FOKTime 
else
 RFQTime=`{ time quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity")
          price=$(echo $quote | jq -r ".price")
          quote_id=$(echo $quote | jq -r ".quote_id")


result=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
            --header "Authorization: Bearer $token" \
            --form "type=$type" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity" \
            --form "price=$price" \
            --form "quote_id=$quote_id");
            echo $result
            } 2>&1`
            echo $RFQTime 
fi



