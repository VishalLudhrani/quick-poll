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
    editToken: "Dummy edit token",
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

  useEffect(() => {
    (async() => {
      setIsLoading(true)
      let { data } = await supabaseClient.from("poll").select("*, questions!questions_poll_id_fkey(*), options!options_poll_id_fkey(*)").eq("vote_token", id);
      let parsedData = data[0];
      console.log(parsedData);
      updatePoll(parsedData);
      setIsLoading(false);
    })();
  }, [id]);

  const updatePoll = (parsedData) => {
    setPoll(prevState => ({
      ...prevState,
      pollName: parsedData.name,
      voteToken: parsedData.vote_token,
      editToken: parsedData.edit_token,
      questions: parsedData.questions.map(parsedQuestion => {
        return {
          value: parsedQuestion.value,
          options: parsedData.options
                              .filter(option => option.question_id === parsedQuestion.id)
                              .map(option => ({id: option.id, value: option.value}))
        }
      })
    }));
  }

  const voteHandler = e => {
    console.log(e.target.value);
  }

  if(isLoading === true) {
    return (
      <div className="flex h-[100vh]">
        <div className="mx-auto my-auto">
          <div className="radial-progress animate-spin mr-4 text-indigo-600" style={{['--value']: 20}}></div>
          <span className="text-2xl font-bold">Fetching poll details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container mt-12 lg:w-8/12 px-2 md:px-4 space-y-8">
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
                          onClick={e => {voteHandler(e)}}
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
    </div>
  );
};

export default CastVote;