TIMEFORMAT=%R  


token=$1
type=$2
side=$3
product_id=$4
quantity=$5



if [ $type = "MKT" ]
then
resultTime=$(curl -o /dev/null -s -w %{time_total} --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
               --header "Authorization: Bearer $token" \
               --form "type=$type" \
               --form "side=$side" \
               --form "product_id=$product_id" \
               --form "quantity=$quantity")
echo $resultTime
elif [ $type = "FOK" ]
then
quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity")

          price=$(echo $quote | jq -r ".price")
          
FOKTime=$(curl -o /dev/null -s -w %{time_total} --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
           --header "Authorization: Bearer $token" \
           --form "type=$type" \
           --form "side=$side" \
           --form "product_id=$product_id" \
           --form "quantity=$quantity" \
           --form "price=$price")
            echo $FOKTime
else
 quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity")
          price=$(echo $quote | jq -r ".price")
          quote_id=$(echo $quote | jq -r ".quote_id")


       RFQTime=$(curl -o /dev/null -s -w %{time_total} POST 'https://sb20.rest-api.enigma-securities.io/trade' \
            --header "Authorization: Bearer $token" \
            --form "type=$type" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$quantity" \
            --form "price=$price" \
            --form "quote_id=$quote_id")
            echo $RFQTime 
fi



