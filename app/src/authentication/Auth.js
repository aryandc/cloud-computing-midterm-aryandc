const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

// User pool data
const poolData = {
    UserPoolId: 'us-west-2_lWpXg0QJj',
    ClientId: 'hibuhib2636nm4cj5qdk1iovd'
}

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)