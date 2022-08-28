# kaimasu-backend

This is the [NodeJS](https://nodejs.org/en/) REST API backend for **Kaimasu** - a demo online store. 

## Installation

**You must have **[npm](https://www.npmjs.com/package/npm)** installed before proceeding further.**

- First clone the repository
	 - `git clone https://github.com/lullabyX/kaimasu-backend.git`
- Then move into the project folder
	- `cd ./kaimasu-backend`
- Then run 'npm install' to install the dependencies
	- `npm install`
-	Run the following command to start development server
	-	`npm start`
  
 **You must have a '.env' file in the root project folder with the following attributes filled to get all the desired functionality of the server**


    `# server
    PORT=8080
    APP_NAME='kaimasu'
    
    # database
    DATABASE=''
    
    # send in blue
    SIB_API_KEY=''
    SIB_ROOM_INVITATION_TEMPLATE_ID=
    SIB_EMAIL_VERIFICATION_TEMPLATE_ID=
    SIB_ACCOUNT_CONFIRMATION=
    
    SYNERGY_FRONTEND='http://localhost:3000'
    
    # jwtt
    JWT_SECRET_KEY=''
    JWT_TOKEN_TIMEOUT='1'
    JWT_REFRESH_SECRET_KEY=''
    JWT_REFRESH_TOKEN_TIMEOUT='48'
    
    # cokie
    COKIE_SECRET=''
    
    # dicebear avatar style
    AVATAR_STYLE=''
    
    # BANK API
    BANKAPIENDPOINT='http://localhost:8080/bank/api'
    
    # E-Commerce Bank Info
    ECOMAPIENDPOINT='http://localhost:8080/ecom/api'
    BANKACCOUNTNAME='E-Commerce'
    BANKACCOUNTNO='1415161718'
    BANKACCOUNTTOKEN='supersecret'
    
    # Supplier Bank Info
    SUPPLIERCUT=.90
    SUPPLIERAPIENDPOINT='http://localhost:8080/supplier/api'
    SUPPLIERBANKACCOUNTNAME='Supplier'
    SUPPLIERBANKACCOUNTNO='01020304050607'
    SUPPLIERBANKACCOUNTTOKEN='supersecret'`
