#!/bin/bash

# Update system packages
yum update -y

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install git
yum install -y git

# Install PM2 globally
npm install -g pm2

# Create app directory
mkdir -p /home/ec2-user/app

# Clone the repository
cd /home/ec2-user/app
git clone https://github.com/jakerains/clientcall.git .

# Install dependencies
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start npm --name "clientcall" -- start

# Save PM2 process list and configure to start on reboot
pm2 save
pm2 startup 