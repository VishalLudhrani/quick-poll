import React from "react";
import { useNavigate } from "react-router-dom";
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
            <p>Quick Poll</p>
            <p>A simple poll creator for community managers.</p>
            <p>A medium for community interaction, achieving productivity with polls, providing insights that serve your community.</p>
            <button onClick={onCreateBtnHandler}>Create Poll</button>
          </React.Fragment>
        </Jumbotron>
      </div>
    </>
  );

};

export default LandingPage;