import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from "use-debounce";
import { supabaseClient } from "../../App";
import isEqual from "lodash.isequal";

const CreateNewPoll = () => {

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
    <div className="content-container mt-12 lg:w-8/12 px-4">
      <div className="flex flex-col md:flex-row">
        <h1 className="text-4xl font-bold flex-auto my-auto">Create a new poll</h1>
        <div className="flex my-4 space-x-2 flex-auto"> {/* heading with the finish button */}
          <button
            className="btn btn-outline btn-primary flex-auto"
            onClick={debouncedAddQuestion}
            disabled={isCreated}
          >
            Add another question
          </button>
          <button 
            className="btn btn-success flex-auto"
            onClick={
              () => {
                createPoll();
                if (!isEqual(initialState, state)) {
                  window.location.href="#success-modal"
                }
              }
            }
            disabled={isCreated}
          >
            Create poll
          </button>
        </div>
      </div>
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
            <span>Poll link: <a style={{ backgroundColor: "#222", borderRadius: "8px", padding: "4px" }} href={process.env.REACT_APP_WEBSITE_URL + "/vote/" + state.voteToken}>{process.env.REACT_APP_WEBSITE_URL}/vote/{state.voteToken}</a></span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm" onClick={() => {handleCopyClipboard("vote")}}>Copy link</button>
          </div>
        </div>
        <br />
        <div id="snackbar2" className="alert shadow-lg alert-info">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Poll results: <a style={{ backgroundColor: "#222", borderRadius: "8px", padding: "4px" }} href={process.env.REACT_APP_WEBSITE_URL + "/result/" + state.voteToken}>{process.env.REACT_APP_WEBSITE_URL}/result/{state.voteToken}</a></span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm" onClick={() => {handleCopyClipboard("result")}}>Copy link</button>
          </div>
        </div>
      </div>
      <div id="questions" className="form-control"> {/* questions container */}
        <div className="space-y-4"> {/* question element */}
          <div className="space-y-2"> {/* poll details */}
            <h4 className="text-xl font-bold">Set a suitable name for your poll:</h4>
            <input
              type="text"
              name="question"
              onChange={e => {debouncedSetState("pollName", e.target.value)}}
              className="input input-bordered w-full" />
          </div>
          {
            state.questions.map((question, questionPos) => {
              return (
                <div className="space-y-2" key={questionPos}>
                  <div className="space-y-2"> {/* question */}
                    <h4 className="text-lg font-bold">Write your question here:</h4>
                    <div className="flex">
                      <span className="flex-1 my-auto text-md font-semibold mr-1">Q{questionPos+1}.</span>
                      <span className="flex-10">
                        <input
                          type="text" 
                          name="question" 
                          onChange={e => {debouncedHandleQuestionChange(e, questionPos)}}
                          className="input input-bordered w-full" />
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2"> {/* options parent container */}
                    <h5 className="text-lg font-bold">Options:</h5>
                    <div className="flex-col space-y-4 sm:w-3/4"> {/* options container */}
                      {
                        question.options.map((option, pos) => {
                          let inputElName = `option${pos + 1}`;
                          return (
                            <div key={pos} className="flex space-x-2"> {/* option element */}
                              <div className="text-sm flex-1 my-auto">
                                <ion-icon name="radio-button-off-outline"></ion-icon>  
                              </div>
                              <div className="input-group flex-10">
                                <input
                                  type="text"
                                  name={inputElName}
                                  onChange={e => debouncedHandleOptionChange(e, pos, questionPos)}
                                  className="input input-bordered w-full" />
                                  <button
                                    onClick={() => deleteOption(pos, questionPos)}
                                    disabled={!(pos > 1)}
                                    className="my-auto mx-auto px-4 text-sm text-center btn btn-error text-white">
                                    <ion-icon name="trash-outline"></ion-icon>
                                  </button>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <button className="btn btn-outline btn-primary btn-sm" onClick={() => addOption(questionPos)}>Add new option</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default CreateNewPoll;