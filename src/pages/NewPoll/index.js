import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from "use-debounce";
import { supabaseClient } from "../../App";
import isEqual from "lodash.isequal";
import HeaderLayout from "../../layouts/HeaderLayout";
import NewPollForm from "../../components/forms/NewPollForm";
import { Alert, Button, IconButton, Typography } from "@mui/material";
import Modal from "../../components/common/Modal";
import { LoadingButton } from "@mui/lab";
import { ContentCopy, OpenInNew } from "@mui/icons-material";

const NewPoll = () => {

  const initialState = {
    pollName: '',
    voteToken: nanoid(8),
    questions: [
      {
        value: '',
        options: [
          {
            id: nanoid(8),
            value: '',
          },
          {
            id: nanoid(8),
            value: '',
          },
        ],
      }
    ]
  }
  
  const [state, setState] = useState(initialState);
  const [ isCreated, setIsCreated ] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSetState = useDebouncedCallback((key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  },500);

  const debouncedHandleOptionChange = useDebouncedCallback((e, optionPos, questionPos) => {
    setState(prevState => ({
      ...prevState,
      questions: prevState.questions.map((question, qPos) =>
        qPos === questionPos
          ? {
              ...question,
              options: question.options.map((option, pos) =>
                optionPos === pos
                  ? { ...option, value: e.target.value }
                  : { ...option }
              ) 
            }
          : { ...question }
      )
    }));
  }, 500);

  const debouncedHandleQuestionChange = useDebouncedCallback((e, pos) => {
    setState(prevState => ({
      ...prevState,
      questions: prevState.questions.map((question, qPos) => 
        pos === qPos 
          ? { ...question, value: e.target.value }
          : { ...question }
      )
    }));
  }, 500);

  const debouncedAddQuestion = useDebouncedCallback(() => {
    setState(prevState => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          value: '',
          options: [
            {
              value: '',
            },
            {
              value: '',
            },
          ],
        }
      ]
    }));
  }, 500);

  const addOption = (qPos) => {
    setState(prevState => ({
      ...prevState,
      questions: prevState.questions.map((question, pos) => 
        pos === qPos
          ? { ...question, options: [ ...question.options, { id: nanoid(8), value: '' } ] }
          : { ...question }
      )
    }));
  }

  const deleteOption = (optionPos, questionPos) => {
    const temp = [ ...state.questions[questionPos].options ];
    temp.splice(optionPos, 1);
    setState(prevState => {
      return {
        ...prevState,
        questions: prevState.questions.map((question, pos) => 
          pos === questionPos
            ? { ...question, options: temp }
            : { ...question }
        )
      }
    });
  }

  const createPoll = async() => {
    if (isEqual(initialState, state)) {
      alert("Kindly fill in all the details and then proceed!");
    } else {
      setIsCreated(true);
      setLoading(true);
      // store basic details
      const { data: pollData, error: pollError } = await supabaseClient
                                                    .from("poll")
                                                    .insert([
                                                      {
                                                        name: state.pollName,
                                                        vote_token: state.voteToken
                                                      },
                                                    ]);
      if (pollError) {
        alert(`An error occured\n${pollError}\nPlease reload the page and try again.`);
      }
  
      // store questions
      let parsedData = pollData[0];
      const { data: questionData, error: questionError } = await supabaseClient
                                                                  .from("questions")
                                                                  .insert(
                                                                    state.questions.map(question => {
                                                                      return {
                                                                        poll_id: parsedData.id,
                                                                        value: question.value
                                                                      }
                                                                    })
                                                                  );
      if(questionError) {
        alert(`An error occured\n${questionError}\nPlease reload the page and try again.`);
      }
  
      // store options
      const { error: optionsError } = await supabaseClient
                                              .from("options")
                                              .insert(
                                                state.questions.map((question, pos) => {
                                                  let storedQuestion = questionData[pos];
                                                  return question.options.map(option => {
                                                    return {
                                                      poll_id: parsedData.id,
                                                      question_id: storedQuestion.id,
                                                      value: option.value
                                                    }
                                                  })
                                                }).flat()
                                              )
      if (optionsError) {
        alert(`An error occured\n${optionsError}\nPlease reload the page and try again.`);
      } else {
        setShowDialog(true);
      }
  
      setLoading(false);
    }

  }

  const handleCopyClipboard = type => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_WEBSITE_URL}/${type}/${state.voteToken}`);
  }

  return (
    <HeaderLayout 
      title="Create a new poll"
      sideMenu={
        <>
          <Button
            onClick={debouncedAddQuestion}
            disabled={isCreated}
            variant="outlined"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Add another question
          </Button>
          <LoadingButton
            onClick={createPoll}
            disabled={isCreated}
            variant="contained"
            loading={loading}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Create poll
          </LoadingButton>
        </>
      }
    >
      <> {/* questions container */}
        {!isCreated ? (
          <NewPollForm
            questions={state.questions}
            onPollNameChange={debouncedSetState}
            onQuestionChange={debouncedHandleQuestionChange}
            onOptionChange={debouncedHandleOptionChange}
            addOption={addOption}
            deleteOption={deleteOption}
          />
        ) : (
          <>
            <Alert
              severity="info"
              action={
                <Button 
                  startIcon={<ContentCopy fontSize="small" />}
                  onClick={() => handleCopyClipboard("vote")}
                >
                  Copy poll link
                </Button>
              }
              sx={{ my: 1 }}
            >
              View Poll <a href={`${process.env.REACT_APP_WEBSITE_URL}/vote/${state.voteToken}`} target="_blank" rel="noreferrer"><IconButton><OpenInNew color="primary" fontSize="small" /></IconButton></a>
            </Alert>
            <Alert
              severity="info"
              action={
                <Button 
                  startIcon={<ContentCopy fontSize="small" />}
                  onClick={() => handleCopyClipboard("result")}
                >
                  Copy result link
                </Button>
              }
              sx={{ my: 1 }}
            >
              View results <a href={`${process.env.REACT_APP_WEBSITE_URL}/result/${state.voteToken}`} target="_blank" rel="noreferrer"><IconButton><OpenInNew color="primary" fontSize="small" /></IconButton></a>
            </Alert>
          </>
        )}
        <Button
          onClick={debouncedAddQuestion}
          disabled={isCreated}
          variant="outlined"
          sx={{ display: { xs: "block", sm: "none" }, mt: 4 }}
          fullWidth
        >
          Add another question
        </Button>
        <LoadingButton
          onClick={createPoll}
          disabled={isCreated}
          variant="contained"
          loading={loading}
          sx={{ display: { xs: "block", sm: "none" }, mt: 2 }}
          fullWidth
        >
          Create poll
        </LoadingButton>
        <Modal
          title="Poll created"
          open={showDialog}
          onClose={() => {setShowDialog(false)}}
        >
          <Typography variant="body1">Your poll was created</Typography>
        </Modal>
      </>
    </HeaderLayout>
  );
};

export default NewPoll;