import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../App";

const Result = () => {

  const { id } = useParams();

  const [ isLoading, setIsLoading ] = useState(true);
  const [ poll, setPoll ] = useState({
    pollName: "Dummy name",
    voteToken: "Dummy token",
    questions: [
      {
        totalVotes: 0,
        value: "Dummy Question",
        options: [
          {
            value: "Dummy option 1",
            votes: 0
          },
          {
            value: "Dummy option 2",
            votes: 0
          },
        ]
      }
    ]
  });
  const [ pollID, setPollID ] = useState(null);

  const fetchPollDetails = useCallback(
    async() => {
      const { data } = await supabaseClient.from("poll").select("*, questions!questions_poll_id_fkey(*), options!options_poll_id_fkey(*), result!result_poll_id_fkey(*)").eq("vote_token", id);
      updatePoll(data[0]);
      setPollID(data[0].id);
      setIsLoading(false);
    },
    [id]
  )

  useEffect(() => {
    fetchPollDetails();
    const result = supabaseClient
                    .from(`result:poll_id=eq.${pollID}`)
                    .on('*', payload => {
                      fetchPollDetails();
                    })
                    .subscribe();
    
    return () => {
      supabaseClient.removeSubscription(result);
    }
  }, [fetchPollDetails, pollID]);

  const updatePoll = data => {
    setPoll(prevState => ({
      ...prevState,
      pollName: data.name,
      voteToken: data.vote_token,
      questions: data.questions.map(question => {
        return {
          id: question.id,
          value: question.value,
          totalVotes: data.result.filter(item => item.question_id === question.id).length,
          options: data.options
                        .filter(option => option.question_id === question.id)
                        .map(option => ({
                          id: option.id,
                          value: option.value,
                          votes: data.result.filter(d => d.option_id === option.id).length
                        }))
        }
      })
    }));
  }

  if(isLoading) {
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
      <h1 className="text-4xl font-bold">{poll.pollName} - poll results</h1>
      {
        poll.questions.map((question, pos) => {
          return (
            <div key={pos} className="space-y-4">
              <h2 className="text-2xl font-semibold">Q{pos+1}. {question.value}</h2>
              <div className="flex flex-col h-full space-y-2">
                {
                  question.options.map((option, optionPos) => {
                    let optionContainerWidth = question.totalVotes === 0 ? 0 : Math.round(option.votes/question.totalVotes*100);
                    return (
                      <div
                      key={optionPos}
                      className="flex-auto text-md text-indigo-400 font-normal px-8 py-4 rounded-lg my-auto">
                        <div style={{position: "relative"}}>
                          <div style={{position: "asbolute", zIndex: 1}} className="px-4 py-2">
                            <span>{option.value} ({optionContainerWidth}%)</span>
                          </div>
                          <div style={{position: "absolute", zIndex: -1, top: 0}} className="w-full">
                            <div style={{position: "relative"}}>
                              <div className="rounded-lg bg-indigo-200 h-10 my-auto" style={{zIndex: 0, width: `${optionContainerWidth}%`}}></div>
                              <div className="border-indigo-600 border-2 h-10 rounded-lg my-auto w-full" style={{zIndex: 1, position: "absolute", top: 0}}></div>
                            </div>
                          </div>
                        </div>
                    </div>
                    )
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

export default Result;