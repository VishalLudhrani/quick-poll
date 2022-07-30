import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from "use-debounce";
import { supabaseClient } from "../../App";
import isEqual from "lodash.isequal";
import HeaderLayout from "../../layouts/HeaderLayout";
import { Button } from "@material-tailwind/react";
import NewPollForm from "../../components/forms/NewPollForm";

const NewPoll = () => {

  const initialState = {
    pollName: '',
    voteToken: nanoid(8),
    questions: [
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
  }
  
  const [state, setState] = useState(initialState);
  const [ isCreated, setIsCreated ] = useState(false);

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
    setState({
      ...state,
      questions: state.questions.map((question, pos) => 
        pos === questionPos
          ? { ...question, options: temp }
          : { ...question }
      )
    });
  }

  const createPoll = async() => {
    if (isEqual(initialState, state)) {
      alert("Kindly fill in all the details and then proceed!");
    } else {
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
      }
  
      setIsCreated(true);
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
          >
            Add another question
          </Button>
          <Button
            onClick={
              () => {
                createPoll();
                if (!isEqual(initialState, state)) {
                  window.location.href="#success-modal"
                }
              }
            }
            disabled={isCreated}
            variant="filled"
          >
            Create poll
          </Button>
        </>
      }
    >
      <div className="modal" id="success-modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Your poll was created!</h3>
          <div className="modal-action">
            <button
              onClick={
                () => {
                  window.location.href = "#";
                  document.querySelector('#questions').classList.add('hidden');
                  document.querySelector('#poll-links').classList.remove('hidden');
                }
              } 
              className="btn btn-outline btn-primary"
            >
                Close
              </button>
          </div>
        </div>
      </div>
      <div id="poll-links" className="hidden">
        <h2 className="text-xl font-bold mb-2">Your poll was created successfully!</h2>
        <div id="snackbar1" className="alert shadow-lg alert-info">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Poll link: <a style={{ backgroundColor: "#eee", borderRadius: "8px", padding: "4px", color: "#222" }} href={process.env.REACT_APP_WEBSITE_URL + "/vote/" + state.voteToken} target="_blank" rel="noreferrer">{process.env.REACT_APP_WEBSITE_URL}/vote/{state.voteToken}</a></span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm" onClick={() => {handleCopyClipboard("vote")}}>Copy link</button>
          </div>
        </div>
        <br />
        <div id="snackbar2" className="alert shadow-lg alert-info">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Poll results: <a style={{ backgroundColor: "#eee", borderRadius: "8px", padding: "4px", color: "#222" }} href={process.env.REACT_APP_WEBSITE_URL + "/result/" + state.voteToken} target="_blank" rel="noreferrer">{process.env.REACT_APP_WEBSITE_URL}/result/{state.voteToken}</a></span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm" onClick={() => {handleCopyClipboard("result")}}>Copy link</button>
          </div>
        </div>
      </div>
      <div id="questions"> {/* questions container */}
        <NewPollForm
          questions={state.questions}
          onPollNameChange={debouncedSetState}
          onQuestionChange={debouncedHandleQuestionChange}
          onOptionChange={debouncedHandleOptionChange}
          addOption={addOption}
          deleteOption={deleteOption}
        />
      </div>
    </HeaderLayout>
  );
};

export default NewPoll;