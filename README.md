# 5min2win

Some extraordinary stuff

Building system to win in your life...

Give me some time

## fresh install from git:

- /random-coding:
- git clone https://github.com/robertSefman/5min2win.git
- cd 5min2win
- yarn install
- cd fromtend
- yarn install
- cd ../backend
- yarn install

## Tech:

- install Gatsby
- install Reakit
- install gatsby-plugin-styled-components
  yarn add gatsby-plugin-styled-components
- install styled tools: npm add styled-tools
- NO: install react toast notifications: npm add react-toast-notifications
  https://github.com/jossmac/react-toast-notifications
- YES: install butter toast: npm install --save butter-toast
  https://github.com/ealush/butter-toast
- install css: npm install css

## Web server:

.../frontend
gatsby develop
http://localhost:8000/

## Backend:

https://swizec.com/blog/typescript-serverless-lambda/swizec/9103

- yarn global add typescript ts-node // TypeScript compiler
- yarn add @types/aws-lambda
- yarn add @types/graphql
- ??-NO! yarn i -D @types/node (https://scotch.io/@nwayve/how-to-build-a-lambda-function-in-typescript)
- yarn global add serverless
  Framework for managing serverless functions (Lambdas, DynamoDB, ... )
  works for Azur, AWS, enables all configuration in serverless.yml file, you don't need to go to AWS
  for configuration. works on all environments (AWS, Azur, ...) automaticly

Setting AWS Lambda credentials for serverless
https://serverless.com/framework/docs/providers/aws/guide/credentials/
serverless config credentials --provider aws --key XXXXXX --secret XXXXXXXX

Serverles.yaml: https://github.com/Swizec/shared-grocery-list/blob/master/server/serverless.yml

- yarn add apollo-server-lambda graphql

graphql uses POST for everything, so you must define: - http:
path: graphql
method: POST
cors: true
in serverless.yml

- yarn add aws-sdk

Dynamo DB save: https://github.com/Swizec/shared-grocery-list/blob/master/server/dynamodb.js
DynamoDB without Apollo: https://github.com/Swizec/shared-grocery-list

- yarn add uuid https://www.npmjs.com/package/uuid
- yarn add @types/uuid

Graphql schema validator: http://toolbox.sangria-graphql.org/format

    https://www.crowdcast.io/e/d7h1f3dl/5 @44:00 - local Apollo server, @58:00

https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

AWS Logs: CloudWatch

widgetId?: string // optional widgetId
widgetId: string! // mandatory widgetId

backend:

- https://a0veo2tny8.execute-api.us-east-1.amazonaws.com/dev/graphql
- serverless deploy --force
- yarn deploy

frontend:

- yarn build
- yarn start == gatsby eploy
- gatsby clean
- gatsby deploy
- rm -rf .cache/ ...brisanje cache-a od gatsbyja

- yarn add react-spinners

na frontend:

- yarn add react-final-form final-form
  https://github.com/final-form/react-final-form

## Usefull:

https://layoutit.com/
https://cssgrid-generator.netlify.com/
https://www.react-spinners.com/
https://popmotion.io/pose/ -- animation

search:

- git grep DYNAMODB_TABLE

## Part ONE:

Sending e-mails

AUTH0
https://swizec.com/blog/gatsby-auth0/swizec/8895

install from git clone (on ramdom_coding):

- yarn install on root, backend and frontend
