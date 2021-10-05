import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { userPool } from "../authentication/Auth";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import { AuthContext } from "../context/AuthContext";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LogoutIcon from "@mui/icons-material/Logout";
import Backdrop from "@mui/material/Backdrop";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import { styled } from "@mui/system";
import axios from "axios";

const theme = createTheme();

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Home = () => {
  const [cognitoUser, setCognitoUser] = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [userSession, setUserSession] = useState(null);
  // const [img, setImg] = useState(
  //   "https://images.hdqwalls.com/wallpapers/the-weeknd-colorful-paintart-4k-l3.jpg"
  // );
  const [img, setImg] = useState(
    "https://i.pinimg.com/originals/70/96/da/7096dad7c26c252dd3fc5cb1e83dc239.jpg"
  );
  const [baseurl, setBaseurl] = useState(
    "https://6fu4jqpn1d.execute-api.us-west-2.amazonaws.com/latest"
  );
  const [startKeyList, setStartKeyList] = useState([]);
  const [nextBtn, setNextBtn] = useState(true);
  const [prevBtn, setPrevBtn] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [songList, setSongList] = useState(null);
  const [actions, setActions] = useState([
    {
      icon: <AddIcon />,
      name: "Add",
      click: () => {
        setShowForm(true);
        setNextBtn(false);
        setPrevBtn(false);
      },
    },
    {
      icon: <LogoutIcon />,
      name: "Logout",
      click: () => {
        handleSignOut();
      },
    },
  ]);
  const [songData, setSongData] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const getSession = () => {
    var user = userPool.getCurrentUser();
    user.getSession(function (err, session) {
      user.getUserAttributes(function (err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }

        setUserSession(session);
        var idToken = session.getIdToken().jwtToken;
        setCognitoUser({ ...cognitoUser, idToken });
        // console.log(idToken);
        // for (let i = 0; i < result.length; i++) {
        //   console.log(
        //     "attribute " +
        //       result[i].getName() +
        //       " has value " +
        //       result[i].getValue()
        //   );
        // }
      });
    });
  };

  useEffect(() => {
    getSession();
  }, []);

  const handleAdd = async (formData) => {
    let song = formData.get("song");
    let artist = formData.get("artist");
    let album = formData.get("album");
    let year = formData.get("year");
    let cover = formData.get("cover");
    let link = formData.get("link");

    var params = {
      song,
      artist,
      album,
      release_year: year,
      cover_img: cover,
      youtube_link: link,
      username: cognitoUser.username ? cognitoUser.username : "",
    };

    await axios
      .post(baseurl + "/songs", params, {
        headers: {
          Authorization: cognitoUser.idToken,
        },
      })
      .then((resp) => {
        // console.log(resp);
        setShowForm(false);
      })
      .catch((err) => {
        console.log(err);
      });

    setNextBtn(true);
    setPrevBtn(true);
  };

  const handleEdit = async (formData) => {
    let song = formData.get("song");
    let artist = formData.get("artist");
    let album = formData.get("album");
    let year = formData.get("year");
    let cover = formData.get("cover");
    let link = formData.get("link");

    if (
      songData == null ||
      songData.username == null ||
      cognitoUser == null ||
      cognitoUser.username != songData.username
    ) {
      alert("Error: couldn't edit data. Please try again!");
      setShowForm(false);
      setShowEdit(false);
      return;
    }

    let username = songData.username;
    let uid = songData.uid;

    var params = {
      song,
      artist,
      album,
      release_year: year,
      cover_img: cover,
      youtube_link: link,
      username: username,
      uid: uid,
    };

    await axios
      .put(baseurl + "/songs/user/" + username + "/id/" + uid, params, {
        headers: {
          Authorization: cognitoUser.idToken,
        },
      })
      .then((resp) => {
        setShowForm(false);
        setShowEdit(false);
        setSongData(params);
      })
      .catch((err) => {
        console.log(err);
      });

    setNextBtn(true);
    setPrevBtn(true);
  };

  const handleDelete = () => {
    let username = songData.username;
    let uid = songData.uid;

    if (username == null || username === "" || uid == null) {
      return;
    }

    if (cognitoUser == null || cognitoUser.username != username) {
      return;
    }

    axios
      .delete(baseurl + "/songs/user/" + username + "/id/" + uid, {
        headers: {
          Authorization: cognitoUser.idToken,
        },
      })
      .then((resp) => {
        setSongData(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (showEdit) {
      handleEdit(formData);
    } else {
      handleAdd(formData);
    }
  };

  const handleSignOut = () => {
    cognitoUser.signOut();
    setCognitoUser(null);
  };

  const handleNext = async () => {
    let lastEvaluatedKey = startKeyList[startKeyList.length - 1];
    if (lastEvaluatedKey == null) {
      return;
    }
    await axios
      .get(baseurl + "/songs/next/" + lastEvaluatedKey.uid, {
        headers: {
          Authorization: cognitoUser.idToken,
        },
      })
      .then((resp) => {
        setSongList(resp.data.songList);
        setStartKeyList([...startKeyList, resp.data.lastEvaluatedKey]);
        console.log("handleNext - startKeyList", startKeyList);
        setPageNumber(pageNumber + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePrev = async () => {
    if (pageNumber <= 1) {
      return;
    }

    if (pageNumber == 2) {
      await axios
        .get(baseurl + "/songs/next", {
          headers: {
            Authorization: cognitoUser.idToken,
          },
        })
        .then((resp) => {
          setSongList(resp.data.songList);
          setStartKeyList([resp.data.lastEvaluatedKey]);
          setPageNumber(1);
        });
    } else {
      var lastEvaluatedKey = startKeyList[pageNumber - 3];
      await axios
        .get(baseurl + "/songs/next/" + lastEvaluatedKey.uid, {
          headers: {
            Authorization: cognitoUser.idToken,
          },
        })
        .then((resp) => {
          setSongList(resp.data.songList);
          startKeyList.pop();
          // startKeyList.pop();
          setStartKeyList(startKeyList);
          setPageNumber(pageNumber - 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePageData = async () => {
    if (pageNumber <= 1) {
      await axios
        .get(baseurl + "/songs/next", {
          headers: {
            Authorization: cognitoUser.idToken,
          },
        })
        .then((resp) => {
          setSongList(resp.data.songList);
          console.log("HERERERERERE");
          setStartKeyList([resp.data.lastEvaluatedKey]);
          setPageNumber(1);
        });
    } else {
      var lastEvaluatedKey = startKeyList[pageNumber - 2];
      await axios
        .get(baseurl + "/songs/next/" + lastEvaluatedKey.uid, {
          headers: {
            Authorization: cognitoUser.idToken,
          },
        })
        .then((resp) => {
          console.log(
            "Accessing: ",
            baseurl + "/songs/next/" + lastEvaluatedKey.uid
          );

          setSongList(resp.data.songList);
          if (startKeyList.length < pageNumber) {
            setStartKeyList([...startKeyList, resp.data.lastEvaluatedKey]);
          }
          console.log("handlePrev normal startKeyList", startKeyList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    handlePageData();
  }, [showForm, cognitoUser, songData]);

  useEffect(() => {}, [showEdit, cognitoUser, songList]);

  return (
    <ThemeProvider theme={theme}>
      <StyledSpeedDial
        ariaLabel="SpeedDial replacing the navbar"
        icon={<LibraryMusicIcon />}
        direction="down"
        tooltipTitle={"Music Library"}
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        {/* Left Grid */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(" + (songData ? songData.cover_img : img) + ")",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            // maxHeight: "1100px",
          }}
        >
          {songData && (
            <div
              style={{
                position: "relative", //don't forget this
                height: "100%",
              }}
            >
              <Backdrop
                open={true}
                sx={{
                  position: "absolute",
                  zIndex: theme.zIndex.drawer - 1,
                }}
              >
                <Card
                  sx={{
                    width: "80%",
                    height: "90%",
                    background: "black",
                    color: "white",
                    borderRadius: 10,
                  }}
                >
                  <ReactPlayer
                    url={songData.youtube_link + "?enablejsapi=1"}
                    config={{
                      youtube: {
                        playerVars: { origin: "https://www.youtube.com" },
                      },
                    }}
                    width="100%"
                    height="65%"
                    controls
                  />
                  <CardContent sx={{ p: 5 }}>
                    <Typography variant="h3" component="div">
                      {songData.song}
                    </Typography>
                    <br />
                    <Typography sx={{ fontSize: 20 }} gutterBottom>
                      {songData.album}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                      Released year: {songData.release_year}
                    </Typography>
                    <Typography variant="body2">
                      Artist: {songData.artist}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 1 }}>
                    {cognitoUser && cognitoUser.username == songData.username && (
                      <Button
                        sx={{ borderRadius: 20 }}
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setShowForm(true);
                          setShowEdit(true);
                          setNextBtn(false);
                          setPrevBtn(false);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    )}
                    {cognitoUser && cognitoUser.username === songData.username && (
                      <Button
                        sx={{ borderRadius: 20 }}
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Backdrop>
            </div>
          )}
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
          <Grid item xs={12} sm={8} md={12} component={Paper} elevation={0}>
            <h1>Music Library</h1>
          </Grid>
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
                  setShowEdit(false);
                  setNextBtn(true);
                  setPrevBtn(true);
                }}
              >
                <CloseIcon />
              </Button>
              {showEdit && (
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
                      defaultValue={showEdit && songData ? songData.song : ""}
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
                      defaultValue={showEdit && songData ? songData.album : ""}
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
                      defaultValue={showEdit && songData ? songData.artist : ""}
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
                      defaultValue={
                        showEdit && songData ? songData.release_year : ""
                      }
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
                      defaultValue={
                        showEdit && songData ? songData.cover_img : ""
                      }
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
                      defaultValue={
                        showEdit && songData ? songData.youtube_link : ""
                      }
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      {"Edit"}
                    </Button>
                  </Box>
                </Box>
              )}

              {!showEdit && (
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
              )}
            </Grid>
          )}
          {!showForm && (
            <>
              <br />
              <br />
              <TableContainer component={Paper}>
                <Table sx={{ m: 0, width: "100%" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Song</StyledTableCell>
                      <StyledTableCell>Album</StyledTableCell>
                      {/* <TStyledTableCell align="right">Artist</StyledTableCell>
                  <StyledTableCell align="right">Release Year</StyledTableCell>
                  <StyledTableCell align="right">Link</StyledTableCell> */}
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
                          onClick={() => {
                            var data = {
                              song: row.song,
                              artist: row.artist,
                              album: row.album,
                              release_year: row.release_year,
                              cover_img: row.cover_img,
                              youtube_link: row.youtube_link,
                              uid: row.uid,
                              username: row.username ? row.username : "",
                            };
                            setSongData(data);
                          }}
                        >
                          <StyledTableCell component="th" scope="row">
                            {row.song}
                          </StyledTableCell>
                          <StyledTableCell>{row.album}</StyledTableCell>
                          {/* <StyledTableCell align="right">{row.artist}</StyledTableCell>
                      <StyledTableCell align="right">{row.release_year}</StyledTableCell>
                      <StyledTableCell align="right">
                        <a href={row.youtube_link} target="_blank">
                          <YouTubeIcon />
                        </a>
                      </StyledTableCell> */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Grid
            container
          >
            <Grid item xs={5}>
              {prevBtn && (
                <Button
                  variant="outlined"
                  sx={{ p: 1, mt: 6, mr: 2 }}
                  onClick={handlePrev}
                  disabled={pageNumber <= 1 ? true : false}
                >
                  <NavigateBeforeIcon />
                </Button>
              )}
            </Grid>
            <Grid item xs={2}>
              {(nextBtn || prevBtn) && (
                <Typography sx={{ p: 1, mt: 6, flexGrow: 1, textAlign: 'center' }} color="text.secondary">
                  {pageNumber}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5}>
              {nextBtn && (
                <Button
                  variant="outlined"
                  sx={{ p: 1, mt: 6, float: "right" }}
                  onClick={handleNext}
                  disabled={
                    startKeyList.length > 0 &&
                    !startKeyList[startKeyList.length - 1]
                      ? true
                      : false
                  }
                >
                  <NavigateNextIcon />
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      )
    </ThemeProvider>
  );
};

export default Home;
