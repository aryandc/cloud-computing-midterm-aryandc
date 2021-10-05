import React, { useContext, useEffect, useState } from "react";



import Button from "@mui/material/Button";

import { Link } from "react-router-dom";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import {makeStyles} from '@mui/styles'
import { useTheme } from "@emotion/react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "2% 0% 2% 0%",
    alignContent: "center",
    borderRadius: 20,
    boxShadow: "10px 10px 30px -1px grey",
  },
  details: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
    marginLeft: "auto",
  },
  controls: {
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: "0px solic black",
    borderRadius: 20,
  },
  media: {
    height: 140,
    display: "flex",
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  link: {
    textDecoration: "none",
  },
  cardActions: {
    float: "right",
  },
}));

export default function SongCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [hidePlaylist, setHidePlaylist] = useState(true);
  const [artistInfo, setArtistInfo] = useState({
    name: "Weekend",
    image: "https://wallpapercave.com/wp/wp5876153.jpg",
  });
  const [albumInfo, setAlbumInfo] = useState({
    cover: "https://wallpapercave.com/wp/wp5876153.jpg",
    name: "After Hour",
    songs: [],
    year: "2020",
  });

  return (
    <div>
      <Card className={classes.root}>
        <CardActionArea
        // onMouseEnter={() => {
        //   try {
        //     if (!playing) {
        //       audio.currentTime = 60;
        //       audio.volume = 0.5;
        //       audio.play();
        //     }
        //   } catch (e) {
        //     console.log(e);
        //   }
        // }}
        // onMouseLeave={() => {
        //   try {
        //     if (!playing) {
        //       audio.pause();
        //       setAudio(new Audio(props.url));
        //     }
        //   } catch (e) {
        //     console.log(e);
        //   }
        // }}
        >
          <CardMedia
            className={classes.media}
            component="img"
            alt="cover"
            height="140"
            image={albumInfo.cover}
            title={albumInfo.name}
          />
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              Song
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Album: {albumInfo.name} ({albumInfo.year})
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Artist: {artistInfo.name}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* {playing && currSong != props.id && (
            <Button size="small" color="primary" onClick={play}>
              <PlayArrow />
            </Button>
          )}
          {!playing && (
            <Button size="small" color="primary" onClick={play}>
              <PlayArrow />
            </Button>
          )}
          {playing && currSong == props.id && (
            <Button size="small" color="primary" onClick={pause}>
              <Pause />
            </Button>
          )} */}
          {/* {!props.hideAlbum && ( */}
            <Link
              className={classes.link}
              to={{
                pathname: "/album",
                state: { artistInfo: artistInfo, albumInfo: albumInfo },
              }}
            >
              <Button size="small" color="primary">
                Go to album
              </Button>
            </Link>
          {/* )} */}

          {/* {!props.hideArtist && ( */}
            <Link
              className={classes.link}
              to={{
                pathname: "/artist",
                state: { artistInfo: artistInfo },
              }}
            >
              <Button size="small" color="primary">
                Go to artist
              </Button>
            </Link>
          {/* )} */}

          {/* {hidePlaylist && (
            <Button size="small" color="primary" onClick={handleAddPlaylist}>
              + Playlist
            </Button>
          )}
          {!hidePlaylist && (
            <Button size="small" color="primary" onClick={handleRemovePlaylist}>
              Remove
            </Button>
          )} */}
        </CardActions>
      </Card>
    </div>
  );
}
