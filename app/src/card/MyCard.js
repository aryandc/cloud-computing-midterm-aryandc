import React, { useEffect, useState } from "react";
import SongCard from "./SongCard";
import { Grid, Paper } from "@mui/material";
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    margin: "10%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    width: "90%",
    margin: "10px 10px",
    boxShadow: "0 0 0",
    fontSize: "x-large",
  },
  link: {
    textDecoration: "none",
  },
  img: {
    width: "90%",
    borderRadius: 20,
    float: "right",
  },
  artist: {
    textDecoration: "none",
    float: "right",
  },
  searchBtn: {
    borderRadius: 200,
  },
}));

export default function MyCard(props) {
  const classes = useStyles();

  return (
    <>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1>The Weeknd</h1>
          </Grid>
          <Grid item xs={12} key={"song.id"}>
                <SongCard/>
              </Grid>
        </Grid>
      </div>
    </>
  );
}