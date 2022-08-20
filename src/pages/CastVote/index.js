// import modules from dependencies
import { Backdrop, Box, Button, CircularProgress, Container, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import custom components, modules
import { supabaseClient } from "../../App";
import Modal from "../../components/common/Modal";

const CastVote = () => {

  let { id } = useParams();

  const [ poll, setPoll ] = useState({
    pollName: "Dummy name",
    voteToken: "Dummy token",
    questions: [
      {
        value: "Dummy Question",
        options: [
          {
            value: "Dummy option 1"
          },
          {
            value: "Dummy option 2"
          },
        ]
      }
    ]
  });
  const [ isLoading, setIsLoading ] = useState(true);
  const [ result, setResult ] = useState([{
    pollID: null,
    questionID: null,
    optionID: null
  }]);
  const [ submitBtnDisabled, setSubmitBtnDisabled ] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    (async() => {
      setIsLoading(true)
      let { data } = await supabaseClient.from("poll").select("*, questions!questions_poll_id_fkey(*), options!options_poll_id_fkey(*)").eq("vote_token", id);
      let parsedData = data[0];
      updatePoll(parsedData);
      setIsLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    let isResult = true;
    for (let item of result) {
      if (!(item.optionID || item.questionID)) {
        isResult = false;
        break;
      }
    }
    setSubmitBtnDisabled(!isResult);
  }, [result]);

  const updatePoll = (parsedData) => {
    setPoll(prevState => ({
      ...prevState,
      pollName: parsedData.name,
      voteToken: parsedData.vote_token,
      questions: parsedData.questions.map(parsedQuestion => {
        return {
          id: parsedQuestion.id,
          value: parsedQuestion.value,
          options: parsedData.options
                              .filter(option => option.question_id === parsedQuestion.id)
                              .map(option => ({id: option.id, value: option.value}))
        }
      })
    }));
    setResult(
      parsedData.questions.map(() => {
        return { pollID: parsedData.id }
      })
    );
  }

  const voteHandler = (optionID, question, pos) => {
    setResult(prevResult => (
      prevResult.map((prev, i) => 
        pos === i
          ? {
              ...prev,
              questionID: question.id,
              optionID: parseInt(optionID)
            }
          : { ...prev }
      )
    ));
  }

  const submitResult = async() => {
    setSubmitBtnDisabled(true);
    const { error } = await supabaseClient
                                    .from("result")
                                    .insert(
                                      result.map(item => {
                                        return {
                                          poll_id: item.pollID,
                                          question_id: item.questionID,
                                          option_id: item.optionID
                                        }
                                      })
                                    )
    if (error) {
      console.error(error);
      alert(`Something went wrong while storing your response.\nKindly reload the page and try again, thank you!`);
    }
  }

  if(isLoading === true) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress />
      </Backdrop>
    )
  }

  return (
    <Container sx={{ mt: 4, py: 2 }}>
      <Typography variant="h4" gutterBottom>{poll.pollName}</Typography>
      {
        poll.questions.map((question, pos) => {
          const selectedOption = result.find(item => item.questionID === question.id)?.optionID;
          return (
            <React.Fragment key={pos}>
              <Typography variant="h6">Q{pos+1}. {question.value}</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  value={selectedOption ?? ''}
                  onChange={e => {voteHandler(e.target.value, question, pos)}}
                >
                  {
                    question.options.map(option => (
                      <FormControlLabel 
                        key={option.id} 
                        value={option.id} 
                        control={<Radio sx={{ display: "none" }} />} 
                        label={option.value}
                        sx={{
                          mt: 1,
                          mx: 0,
                          pl: 2,
                          py: 1,
                          border: "1px solid blue",
                          borderRadius: 1,
                          backgroundColor: selectedOption === option.id ? "skyblue" : "transparent",
                        }}
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
            </React.Fragment>
          )
        })
      }
      <Box sx={{ textAlign: "center" }}>
        <Button 
          onClick={() => {
            submitResult();
            setShowDialog(true);
          }} 
          disabled={submitBtnDisabled} 
          sx={{ mt: 2, width: "8em" }}
          variant="contained"
        >
          Submit
        </Button>
      </Box>
      <Modal 
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          window.location.href = "/"
        }}
        title="Your vote was casted"
      >
        Thank you for participating!
      </Modal>
    </Container>
  );
};

export default CastVote;