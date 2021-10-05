import React, { useContext, useEffect, useState } from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import YouTubeIcon from "@mui/icons-material/YouTube";

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import NavBar from "../navbar/NavBar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const theme = createTheme();

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Homepage = () => {
  const [cognitoUser, setCognitoUser] = useContext(AuthContext);
  const [img, setImg] = useState(
    "https://images.hdqwalls.com/wallpapers/the-weeknd-colorful-paintart-4k-l3.jpg"
  );
  const [baseurl, setBaseurl] = useState(
    "https://6fu4jqpn1d.execute-api.us-west-2.amazonaws.com/latest"
  );
  const [showForm, setShowForm] = useState(false);
  const [songList, setSongList] = useState(null);
  const [actions, setActions] = useState([
    { icon: <AddIcon />, name: 'Add', click: () => {setShowForm(true)} },
    { icon: <LogoutIcon />, name: 'Logout', click : () => {handleSignOut()} },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(baseurl + "/songs");
      console.log("data: ", data.data);
      setSongList(data.data);
    };
    fetchData();
  }, []);

  const handleAdd = async (formData) => {
    let song = formData.get("song");
    let artist = formData.get("artist");
    let album = formData.get("album");
    let year = formData.get("year");
    let cover = formData.get("cover");
    let link = formData.get("link");

    console.log("song", song);
    console.log("artist", artist);
    console.log("album", album);
    console.log("year", year);
    console.log("cover", cover);
    console.log("link", link);

    var params = {
      song,
      artist,
      album,
      release_year: year,
      cover_img: cover,
      youtube_link: link,
    };

    await axios
      .post(baseurl + "/songs", params)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {}, [songList]);

  const getUserSession = () => {
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log("session validity:", session.isValid());
        console.log("session:", session);
        console.log("token:", session.accessToken);
      });
    }
  };

  useEffect(() => {
    getUserSession();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleAdd(formData);
  };

  const handleSignOut = () => {
    console.log(cognitoUser);
    cognitoUser.signOut();
    setCognitoUser(null);
  };

  useEffect(() => {}, [cognitoUser]);

  return (
    <ThemeProvider theme={theme}>
      {/* <NavBar /> */}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        {/* Left Grid */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(" + img + ")",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            // filter: "blur(5px)",
            maxHeight: "1000px",
          }}
        >
          <Box
            sx={{
              display: "flex-end",
              "& > :not(style)": {
                m: 1,
                width: "80%",
                height: "80%",
              },
            }}
          >
            <Paper variant="outlined">
              <Grid
                item
                xs={12}
                sm={4}
                md={12}
                component={Paper}
                elevation={6}
                sx={{ p: 10 }}
                square
              >
                Hello
              </Grid>
            </Paper>
          </Box>

          {/* <Grid
            item
            xs={12}
            sm={4}
            md={12}
            component={Paper}
            elevation={6}
            sx={{ p: 10 }}
            square
          >
            <Grid
              item
              xs={12}
              sm={8}
              md={12}
              sx={{ p: 2, mb: 2 }}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="song"
                    label="Song"
                    name="song"
                    autoComplete="song"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="album"
                    label="Album"
                    name="album"
                    autoComplete="album"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="artist"
                    label="Artist"
                    name="artist"
                    autoComplete="artist"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="year"
                    label="Release Year"
                    name="year"
                    autoComplete="year"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cover"
                    label="Cover Image"
                    name="cover"
                    autoComplete="cover"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="link"
                    label="Youtube Link"
                    name="link"
                    autoComplete="link"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {"Add"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          
          </Grid> */}
        </Grid>

        {/* Right Grid */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          sx={{ p: 10 }}
          square
        >
          <StyledSpeedDial
          ariaLabel="SpeedDial playground example"
          // hidden={hidden}
          icon={<SpeedDialIcon />}
          direction="down"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.click}
            />
          ))}
        </StyledSpeedDial>
          {/* <Button
            variant="outlined"
            sx={{ p: 1, mb: 2 }}
            onClick={() => {
              setShowForm(true);
            }}
          >
            <AddIcon />
          </Button> */}

          {showForm && (
            <Grid
              item
              xs={12}
              sm={8}
              md={12}
              sx={{ p: 2, mb: 2 }}
              component={Paper}
              elevation={6}
              square
            >
              <Button
                variant="outlined"
                sx={{ p: 1, mb: 2 }}
                onClick={() => {
                  setShowForm(false);
                }}
              >
                <CloseIcon />
              </Button>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="song"
                    label="Song"
                    name="song"
                    autoComplete="song"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="album"
                    label="Album"
                    name="album"
                    autoComplete="album"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="artist"
                    label="Artist"
                    name="artist"
                    autoComplete="artist"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="year"
                    label="Release Year"
                    name="year"
                    autoComplete="year"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cover"
                    label="Cover Image"
                    name="cover"
                    autoComplete="cover"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="link"
                    label="Youtube Link"
                    name="link"
                    autoComplete="link"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {"Add"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}

          {!showForm && (
            <TableContainer component={Paper}>
              <Table sx={{ m: 2 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Song</TableCell>
                    <TableCell>Album</TableCell>
                    {/* <TableCell align="right">Artist</TableCell>
                  <TableCell align="right">Release Year</TableCell>
                  <TableCell align="right">Link</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {songList &&
                    songList.map((row) => (
                      <TableRow
                        key={row.uid}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => setImg(row.cover_img)}
                      >
                        <TableCell component="th" scope="row">
                          {row.song}
                        </TableCell>
                        <TableCell>{row.album}</TableCell>
                        {/* <TableCell align="right">{row.artist}</TableCell>
                      <TableCell align="right">{row.release_year}</TableCell>
                      <TableCell align="right">
                        <a href={row.youtube_link} target="_blank">
                          <YouTubeIcon />
                        </a>
                      </TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
      )
    </ThemeProvider>
  );
};

export default Homepage;
