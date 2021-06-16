#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;36m'
NC='\033[0m'

helpFunction()
{
   echo ""
   echo "Usage: $0 -p profile -b bucket -e environment"
   echo -e "\t-p aws profile you would like to sync as"
   echo -e "\t-b aws bucket to sync to"
   echo -e "\t-e environment to build project as"
   exit 1 # Exit script after printing help
}

while getopts "p:b:e:" opt
do
   case "$opt" in
      p ) profile="$OPTARG" ;;
      b ) bucket="$OPTARG" ;;
      e ) environment="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$profile" ] || [ -z "$bucket" ] || [ -z "$environment" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

echo -e "Build started with ${BLUE}$environment${NC} ..."
cd ..
ng build --configuration=$environment

echo -e "${YELLOW}Start S3 sync to ${BLUE}$bucket${YELLOW} as ${BLUE}$profile${YELLOW}? y/n${NC}"
read start

if [ $start = "y" ]; then
    echo "Sync started..."
    cd dist/angular-picks-app/
    aws s3 sync . s3://$bucket --delete --profile $profile
    echo -e "${GREEN}Process compelete${NC}"
else 
    echo -e "${RED}Cancelled${NC}"
fi