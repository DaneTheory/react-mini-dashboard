#!/bin/bash


PRINTF=/usr/bin/printf
GROUP=apache
# Color codes for printing
redColor='\033[0;31m'
noColor='\033[0m' # No Color


echo "==============================================================="
echo "Build: NPM Install (as dashboard-react user)..."
echo "==============================================================="
sleep 3
npm install
rc=$?
if [ $rc -eq 0 ]; then
   $PRINTF "Return Code: %d\n" $rc
else 
   $PRINTF "${redColor}WARNING: Return Code: %d${noColor}" $rc
fi
echo; echo;

echo "==============================================================="
echo "Build: React build command (as dashboard-react user)"
echo "==============================================================="
sleep 3
npm run build
rc=$?
if [ $rc -eq 0 ]; then
   $PRINTF "Return Code: %d\n" $rc
else 
   $PRINTF "${redColor}WARNING: Return Code: %d${noColor}" $rc
fi
echo; echo;


