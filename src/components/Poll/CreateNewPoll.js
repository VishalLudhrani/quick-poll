import React, { useState, useEffect } from "react";
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from "use-debounce";

const CreateNewPoll = () => {

  const initialState = {
    pollName: '',
    pollToken: '',
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

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      pollToken: nanoid(6)
    }));
  }, []);

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
          ? { ...question, options: [ ...question.options, { value: '' } ] }
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

  const createPoll = () => {
    console.log(state);
  }

  return (
    <div className="content-container mt-12 lg:w-8/12 px-4">
      <div className="flex flex-col md:flex-row">
        <h1 className="text-4xl font-bold flex-auto my-auto">Create a new poll</h1>
        <div className="flex my-4 space-x-2 flex-auto"> {/* heading with the finish button */}
          <div className="btn btn-outline btn-primary flex-auto" onClick={debouncedAddQuestion}>Add another question</div>
          <div className="btn btn-success flex-auto" onClick={createPoll}>Create poll</div>
        </div>
      </div>
      <div className="form-control"> {/* questions container */}
        <div className="space-y-4"> {/* question element */}
          <div className="space-y-2"> {/* poll details */}
            <h4 className="text-xl font-bold">Set a suitable name for your poll:</h4>
            <input
              type="text"
              name="question"
              onChange={e => {debouncedSetState("pollName", e.target.value)}}
              className="input input-bordered w-full" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              Your poll token is {state.pollToken ? (
                <code className="bg-indigo-600">{state.pollToken}</code>
              ) : "loading..."}
            </h3>
            <p className="text-lg">This token will be used as a password when you need to edit your poll. Kindly keep this safe with you.</p>
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