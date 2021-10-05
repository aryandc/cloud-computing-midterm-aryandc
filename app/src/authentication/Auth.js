import Config from '../config.json'
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

// User pool data
const poolData = {
    UserPoolId: Config.userPoolID,
    ClientId: Config.clientID
}

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)