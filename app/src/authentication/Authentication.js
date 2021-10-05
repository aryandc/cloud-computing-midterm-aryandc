import React, { useContext } from 'react'
import * as AWS from 'aws-sdk/global'
import { userPool } from './Auth'
import {
    BrowserRouter as Router,
    Switch,
} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

var AmazonCognitoIdentity = require('amazon-cognito-identity-js')

function Authentication() {
    const authContext = useContext(AuthContext);

    const authenticate = (username, password) => {
        if (username.length == 0 || password.length == 0) {
            return;
        }
        var authenticationData = {
            Username: username,
            Password: password
        }

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
            authenticationData
        );

        var poolData = {
            UserPoolId: 'us-west-2_lWpXg0QJj', // Your user pool id here
            ClientId: 'hibuhib2636nm4cj5qdk1iovd', // Your client id here
        };

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: 'test',
            Pool: userPool
        }

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (res) => {
                var accessToken = res.getAccessToken().getJwtToken()
                AWS.config.region = 'us-west-2'; // Region
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-west-2:9434f3a5-195a-4d45-81a6-47bd009e92b2',
                    Logins: {
                        'cognito-idp.us-west-2.amazonaws.com/us-west-2_lWpXg0QJj': res.getIdToken().getJwtToken()
                    }
                });
                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                AWS.config.credentials.refresh(error => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Instantiate aws sdk service objects now that the credentials have been updated.
                        // example: var s3 = new AWS.S3();
                        console.log('Successfully logged!');
                    }
                });
                const userResponse = {
                    cognitoUser: cognitoUser
                };
                authContext.login(userResponse.cognitoUser);
            },
            onFailure: (err) => {
                alert(err.message || JSON.stringify(err))
            }
        })
    }

    const getAttributes = () => {
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    alert(err.message || JSON.stringify(err))
                    return
                }
                console.log('session validity: ' + session.isValid())
                console.log('session', session)

                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        // handle error
                        console.log(err);
                    } else {
                        console.log(attributes)
                    }
                })

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-west-2:9434f3a5-195a-4d45-81a6-47bd009e92b2',
                    Logins: {
                        'cognito-idp.us-west-2.amazonaws.com/us-west-2_lWpXg0QJj': session.getIdToken().getJwtToken()
                    }
                });
            })
        }
    }

    const handleSignup = (username, email, password) => {
        var attributeList = []

        var dataEmail = {
            Name: 'email',
            Value: email
        }

        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
        attributeList.push(attributeEmail)

        userPool.signUp(username, password, attributeList, null, function (
            err,
            result
        ) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });
    }

    const handleConfirmatioCode = (username, code) => {
        var poolData = {
            UserPoolId: 'us-west-2_lWpXg0QJj', // Your user pool id here
            ClientId: 'hibuhib2636nm4cj5qdk1iovd', // Your client id here
        };
        
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username: username,
            Pool: userPool,
        };
        
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, function(err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log('call result: ' + result);
        });
    }

    const handleResendCode = (username) => {
        var userData = {
            Username: username,
            Pool: userPool,
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log('call result: ' + result);
        });
    }

    const handleSignout = () => {
        if ('test' == "") {
            return;
        }
        var cognitoUser = userPool.getCurrentUser();
        cognitoUser.signOut();
        authContext.logout();
        console.log("successfully logout!")
    }

    authContext.authenticate = authenticate
    authContext.attributes = getAttributes
    authContext.signup = handleSignup
    authContext.signout = handleSignout
    authContext.confirmationCode = handleConfirmatioCode

    return (
        <>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                {!authContext.isLoggedIn && <a href='/login'>login</a>}
                            </li>
                            <li>
                                {authContext.isLoggedIn && <button onClick={getAttributes}>get attributes</button>}
                            </li>
                            <li>
                                {authContext.isLoggedIn && <button onClick={handleSignout}>sign out</button>}
                            </li>
                        </ul>
                    </nav>

                    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                    <Switch>
                    </Switch>
                </div>
            </Router>
        </>
    )
}

export default Authentication