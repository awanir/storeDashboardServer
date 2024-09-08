How to run the project:

1. Clone the repository
2. Create a .env file and add these fields and fill them accordingly:
   PORT=
   MONGO_URI=
   CORS_ORIGIN=

   KAFKA_TOPIC=
   KAFKA_CLIENT_ID=
   KAFKA_URL=
   KAFKA_GROUP_ID=

3. run "npm install" in command line
4. Start the project using "npm start"

OPTIONALLY:

1. run "ts-node ./src/insertData.ts" from root directory to add dummy documents in mongodb database
2. run "ts-node ./src/sendMessageScript.ts" from root directory to manually publish the message for kafka
