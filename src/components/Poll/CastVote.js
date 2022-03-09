// import modules from dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import custom components, modules
import { supabaseClient } from "../../App";

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

  const voteHandler = (option, question, pos) => {
    setResult(prevResult => (
      prevResult.map((prev, i) => 
        pos === i
          ? {
              ...prev,
              questionID: question.id,
              optionID: option.id
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
      <div className="flex h-[100vh]">
        <div className="mx-auto my-auto">
          <div className="radial-progress animate-spin mr-4 text-indigo-600" style={{'--value': 20}}></div>
          <span className="text-2xl font-bold">Fetching poll details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container mt-12 lg:w-8/12 px-2 md:px-4 space-y-8">
      <div className="modal" id="success-modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Your vote was casted, thank you for participating!</h3>
          <div className="modal-action">
            <a href="/" className="btn btn-outline btn-primary">Close</a>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold">{poll.pollName}</h1>
      {
        poll.questions.map((question, pos) => {
          return (
            <div key={pos} className="space-y-4">
              <h2 className="text-2xl font-semibold">Q{pos+1}. {question.value}</h2>
              <div className="flex flex-col h-full space-y-2">
                {
                  question.options.map((option, optionPos) => {
                    if (option) {
                      return (
                        <div
                        key={optionPos}
                        className="flex-auto text-md font-medium uppercase tracking-wide px-8 py-4 rounded-lg my-auto space-x-2">
                        <input
                          type="radio"
                          name={`question${pos}`}
                          id={`${pos}.${optionPos}`}
                          value={option.value}
                          onClick={() => {voteHandler(option, question, pos)}}
                          className="hidden peer" />
                        <label htmlFor={`${pos}.${optionPos}`} className="flex gap-4 p-4 rounded-lg bg-opacity-90 border-2 border-indigo-600 hover:bg-opacity-75 peer-checked:bg-indigo-600 peer-checked:text-white cursor-pointer transition">
                          <div>
                            <span>{option.value}</span>
                          </div>
                        </label>
                      </div>
                      )
                    } else return <div></div>
                  })
                }
              </div>
            </div>
          )
        })
      }
      <div className="flex">
        <a href="#success-modal" className="btn btn-success w-[25vw] mx-auto" onClick={submitResult} disabled={submitBtnDisabled}>Submit</a>
      </div>
    </div>
  );
};

export default CastVote;