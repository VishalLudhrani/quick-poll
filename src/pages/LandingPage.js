import { Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Jumbotron from "../components/common/Jumbotron";

const LandingPage = () => {

  const navigate = useNavigate();

  const onCreateBtnHandler = () => {
    navigate("/new");
  }

  return (
    <Jumbotron sx={{ textAlign: "center" }}>
      <React.Fragment>
        <Typography variant="h2" component="h1">Quick Poll</Typography>
        <Typography variant="h5">A simple poll creator for community managers.</Typography>
        <Typography>A medium for community interaction, achieving productivity with polls, providing insights that serve your community.</Typography>
        <Button onClick={onCreateBtnHandler} variant="contained">Create Poll</Button>
      </React.Fragment>
    </Jumbotron>
  );

};

export default LandingPage;