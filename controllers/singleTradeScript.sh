TIMEFORMAT=%R
token=$1
type=$2
side=$3
product_id=$4
quantity=$5
if [ $type = "MKT" ]
then
{ time result=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
               --header "Authorization: Bearer $token" \
               --form "type=$type" \
               --form "side=$side" \
               --form "product_id=$product_id" \
               --form "quantity=$quantity");} 2> MKT.txt
              MKTTime=$(cat MKT.txt)
echo $MKTTime
elif [ $type = "FOK" ]
then
{ time quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$qty")
          price=$(echo $quote | jq -r ".price")
          
curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
           --header "Authorization: Bearer $token" \
           --form "type=$type" \
           --form "side=$side" \
           --form "product_id=$product_id" \
           --form "quantity=$quantity" \
           --form "price=$price";} 2> FOK.txt
            FOKTime=$(cat FOK.txt)
            echo $FOKTime
else
{ time quote=$(curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/quote' \
            --header "Authorization: Bearer $token" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$qty")
          price=$(echo $quote | jq -r ".price")
          quote_id=$(echo $quote | jq -r ".quote_id")


       curl -s --location --request POST 'https://sb20.rest-api.enigma-securities.io/trade' \
            --header "Authorization: Bearer $token" \
            --form "type=$type" \
            --form "side=$side" \
            --form "product_id=$product_id" \
            --form "quantity=$qty" \
            --form "price=$price" \
            --form "quote_id=$quote_id";} 2> RFQ.txt
            RFQTime=$(cat RFQ.txt)
            echo $RFQTime 
fi



