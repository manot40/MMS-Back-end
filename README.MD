# MR Management System (MMS)

## 🚀 Introduction
MMS is an application that provides API logic for simple warehouse stock management with ease. Some key features:
- Role based access
- Transaction assessment
- Monthly stock opname reporting
- Empty stock reminder
- Deployable to serverless
- ...and much still in development

This API is part of the MMS Front-end WebApp that can be found in this [Repo](https://github.com/manot40/MMS-Front-end)

## 🔨 Setup
This app use express to run the web server, and mongoose (MongoDB) for model data mapping, which would need to set up node.js environment.

### Requirements
- Computer with Windows 10 or Linux
- Node.js 14 or greater
- MongoDB [Atlas instance](https://mongodb.com/cloud/atlas)

### Configuration
1. Clone this repository, enter project directory
2. Rename `.env.example` file to `.env`
3. Open the `.env` file and customize the configuration

The configuration consist of:
```
# Application Configuration
SVR_PORT        // Default app listen port
CLUSTER         // Set to true to use nodejs multithread feature
THREAD_LIMIT    // Adjust maximum cluster thread limit

# Database Configuration
DB_HOST         // Database namehost
DB_NAME         // Database name
DB_USERNAME     // Database access username
DB_PASSWORD     // Database access password

# CORS Configurations
CORS_WHITELIST  // Provide whitelist site (separate with semicolons ';')

# JsonWebToken Configuration (JWT)
JWT_ACCESSTOKEN_TTL     // JWT expiry time, use 'ms' format (https://github.com/vercel/ms)
JWT_REFRESHTOKEN_TTL    // JWT refresh expiry time, use 'ms' format
JWT_PRIVATE_KEY         // Specify private key to encrypt JWT token
```

### Installation
Open terminal in project directory, and enter this command for development env:
```
npm install
npm run dev
```

For production environment, instead use this command:
```
npm install
npm run build
npm start
```

This will install all dependencies and run the app.

For API Documentation, run the app and open http://localhost:6900 on your browser.