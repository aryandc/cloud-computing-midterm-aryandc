import React, { useContext, useState } from "react";
import { userPool } from "../authentication/Auth";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const Login = () => {
  // const classes = useStyles()
  const history = useHistory();
  const [showLogin, setShowLogin] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [cognitoUser, setCognitoUser] = useContext(AuthContext);

  // handles login/sign up
  const handleSubmit = (e) => {
    e.preventDefault();
    const credential = new FormData(e.currentTarget);
    if (showLogin) {
      handleLogin(credential);
    } else {
      handleSignUp(credential);
    }
  };

  // logs user in and set cognitoUser state with user cognito information
  const handleLogin = async (credential) => {
    const authenticationData = {
      Username: credential.get("username"),
      Password: credential.get("password"),
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    var poolData = {
      UserPoolId: "us-west-2_lWpXg0QJj", // Your user pool id here
      ClientId: "hibuhib2636nm4cj5qdk1iovd", // Your client id here
    };

    console.log("poolData", poolData);

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var userData = {
      Username: credential.get("username"),
      Pool: userPool,
    };

    console.log("userData", userData);

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (res) => {
        var accessToken = res.getAccessToken().getJwtToken();

        /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
        // var idToken = res.idToken.jwtToken;
        // console.log('accessToken: ', accessToken)
        // console.log('idToken: ', idToken)

        AWS.config.region = "us-west-2";
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: "us-west-2:9434f3a5-195a-4d45-81a6-47bd009e92b2",
          Logins: {
            "cognito-idp.us-west-2.amazonaws.com/us-west-2_lWpXg0QJj": res
              .getIdToken()
              .getJwtToken(),
          },
        });
        AWS.config.credentials.clearCachedId();
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log("Successfully logged!");
            setCognitoUser(cognitoUser);
            history.push("/");
          }
        });
      },
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
      },
    });
  };

  // signup a new user with auto confirmation of email
  const handleSignUp = async (credential) => {
    let attributeList = [];
    var dataEmail = {
      Name: "email",
      Value: credential.get("email"),
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );
    attributeList.push(attributeEmail);
    userPool.signUp(
      credential.get("username"),
      credential.get("password"),
      attributeList,
      null,
      (err, result) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        var cognitoUser = result.user;
        console.log("user name is " + cognitoUser.getUsername());
        handleLogin(credential);
      }
    );
  };

  // change form based on login/sign up
  const handleForm = () => {
    setShowLogin(!showLogin);
  };

  // render the login webpage
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://i.pinimg.com/originals/70/96/da/7096dad7c26c252dd3fc5cb1e83dc239.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} sm={8} md={12} component={Paper} elevation={0}>
            <Typography component="h1" variant="div">
              {'Music Library'}
            </Typography>
            </Grid>
            <br/>
            <br/>
            <br/>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              {showLogin ? <LoginIcon/> : <LockOutlinedIcon />}
            </Avatar>
            <Typography component="h1" variant="h5">
              {showLogin ? "Login" : "Sign up"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: 500 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              {!showLogin && !showCode && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
              )}
              {!showCode && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              )}
              {showCode && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="code"
                  label="Verification Code"
                  type="code"
                  id="code"
                  autoComplete="code"
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {showLogin ? "Sign in" : showCode ? "Verify Code" : "Sign up"}
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link onClick={handleForm} variant="body2">
                    {showLogin
                      ? "Alreade have an account? Login"
                      : "Don't have an account? Sign up instead"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      )
    </ThemeProvider>
  );
};

export default Login;
