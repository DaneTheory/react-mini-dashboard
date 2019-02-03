#!/bin/bash



PRINTF=/usr/bin/printf
$PRINTF "\n\nStarting deployment...\n\n"

# Color codes for printing
redColor='\033[0;31m'
noColor='\033[0m' # No Color

# Verify user is root
if ! [ $(id -u) = 0 ]; then
   $PRINTF "\n   Yikes, this script requires root.  Bailing out...\n\n"
   exit 1
fi

# Verify current directory is correct
if [ ! -f ./package.json ]; then 
    $PRINTF "\n\n   Yikes, can't find 'index.php', so you might not be in the correct directing, exiting...\n\n"
    exit 1;
fi

# Verify that we're in the right nodejs director
if ! grep \"name\":\ \"mini-dashboard\" package.json > /dev/null
then
    $PRINTF "\n\n   Yikes, package.json file doesn't contain the correct package name, are you in the right directory ?  exiting...\n\n"
    exit 1;
fi

echo "==============================================================="
echo "Deploy: Git pull (as dashboard-react user)..."
echo "==============================================================="
sleep 3
su dashboard-react -c "git pull"
rc=$?
if [ $rc -eq 0 ]; then
   $PRINTF "Return Code: %d\n" $rc
else 
   $PRINTF "${redColor}WARNING: Return Code: %d${noColor}" $rc
fi
echo; echo;


# ====================
# Run the build script, made it separate to minimize the commands in this file, means that I can update build.sh as part of the deploy
# ====================
su dashboard-react -c "./build.sh"
# No need to check return code here, as all commands in this file also check return code

echo "==============================================================="
echo "Deploy: systemctl service restart command (as root user)"
echo "==============================================================="
sleep 3
systemctl restart dashboard-react
rc=$?
if [ $rc -eq 0 ]; then
   $PRINTF "Return Code: %d\n" $rc
else 
   $PRINTF "${redColor}WARNING: Return Code: %d${noColor}" $rc
fi
echo; echo;

