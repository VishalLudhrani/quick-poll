import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import Jumbotron from "./common/Jumbotron";

const LandingPage = () => {

  const navigate = useNavigate();

  const onCreateBtnHandler = () => {
    navigate("/new");
  }

  return (
    <>
      <div className="App">
        <Jumbotron>
          <React.Fragment>
            <Typography variant="h1" as="h1">Quick Poll</Typography>
            <Typography variant="h3" as="h3" className="mt-4">A simple poll creator for community managers.</Typography>
            <Typography variant="lead" as="h6" className="my-4">A medium for community interaction, achieving productivity with polls, providing insights that serve your community.</Typography>
            <Button onClick={onCreateBtnHandler} size="lg" className="normal-case" variant="gradient">Create Poll</Button>
          </React.Fragment>
        </Jumbotron>
      </div>
    </>
  );

};

export default LandingPage;