#!/usr/bin/env bash

mkdir -p temp
echo "Updating Apt"
apt-get update
echo "Installing Apt files"
apt-get install vim certbot php-cgi curl mongodb -y

echo "Install node v14"

curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o temp/n
bash temp/n 12

echo "Starting DB service"

service mongodb start

echo "Installing Npm packages for main"
npm install

echo "Setting Up Daemon App Daemonize"
npm i -g pm2 forever



echo "Setting Up Enviromental Files"

echo "Checking Hostname IP....."
hostIp=`hostname -I|xargs`
echo "Host ip is $hostIp"


echo "Generating Secret....."
newSecret=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

siteAuth=`openssl rand -hex 32`

echo "Generating Defaults......."
export MANAGER_USERNAME="nkp"
pm3Port=5111
hostPort=3000

echo "Finished Generating Defaults......"


echo "Settig up packages for nkp"
cd nkp
bash setup-nkp.sh


echo "Finished installing nkp packages"
cd -

cat > ".env" <<- EOM
HOST_IP=$hostIp

# MONGODB_URI=$MONGODB_URI

HOST_PORT=$hostPort

SITE_AUTH=$siteAuth

PM3_PORT=$pm3Port

EOM

echo "ALL IS OK."
