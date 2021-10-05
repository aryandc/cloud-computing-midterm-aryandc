import React, { useContext, useEffect } from "react";
import NavBar from "../navbar/NavBar";
import { AuthContext } from "../context/AuthContext";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import MyCard from "../card/MyCard";

const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const [cognitoUser, setCognitoUser] = useContext(AuthContext);
  const handleSignOut = () => {
    console.log(cognitoUser);
    cognitoUser.signOut();
    setCognitoUser(null);
  };

  useEffect(() => {}, [cognitoUser]);

  return (
    <>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Grid container style={{width: '90%', margin: '0 auto'}}>
          {/* <Grid item xs={12} md={8}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://wallpapercave.com/wp/wp5876153.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid> */}
          
          {/* <Grid item xs={12} md={8}>
            <Card sx={{ display: "flex" }}>
            <CardMedia sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                component="img"
                sx={{ width: 151 }}
                image="https://wallpapercave.com/wp/wp5876153.jpg"
                alt="Live from space album cover"
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h5">
                    Live From Space
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    Mac Miller
                  </Typography>
                </CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                >
                  <IconButton aria-label="previous">
                    {theme.direction === "rtl" ? (
                      <SkipNextIcon />
                    ) : (
                      <SkipPreviousIcon />
                    )}
                  </IconButton>
                  <IconButton aria-label="play/pause">
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                  </IconButton>
                  <IconButton aria-label="next">
                    {theme.direction === "rtl" ? (
                      <SkipPreviousIcon />
                    ) : (
                      <SkipNextIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid> */}
          <MyCard/>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Home;
