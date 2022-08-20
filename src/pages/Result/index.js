import { Backdrop, Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
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
  const [ votersCount, setVotersCount ] = useState(0);

  const fetchPollDetails = useCallback(
    async() => {
      const { data } = await supabaseClient.from("poll").select("*, questions!questions_poll_id_fkey(*), options!options_poll_id_fkey(*), result!result_poll_id_fkey(*)").eq("vote_token", id);
      updatePoll(data[0]);
      setPollID(data[0].id);
      setIsLoading(false);
      setVotersCount(data[0].result.length / data[0].questions.length);
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
      <Backdrop
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Container sx={{ mt: 4, py: 2 }}>
      <Typography variant="h4" gutterBottom>{poll.pollName} - poll results</Typography>
      <Typography variant="h5" gutterBottom>Total voters - {votersCount}</Typography>
      {
        poll.questions.map((question, pos) => {
          return (
            <React.Fragment key={pos}>
              <Typography variant="h6" mt={2} gutterBottom>Q{pos+1}. {question.value}</Typography>
              {
                question.options.map((option, optionPos) => {
                  let optionContainerWidth = question.totalVotes === 0 ? 0 : Math.round(option.votes/question.totalVotes*100);
                  return (
                    <Box
                      key={optionPos}
                      sx={{
                        px: 2,
                        py: 1,
                        border: "1px solid blue",
                        borderRadius: 1,
                        my: 1,
                      }}
                      className="flex-auto text-md text-indigo-400 font-normal px-8 py-4 rounded-lg my-auto"
                    >
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "asbolute", zIndex: 1 }} className="px-4 py-2">
                          <span>{option.value} <span className="font-bold">({option.votes})</span></span>
                        </div>
                        <div style={{ position: "absolute", zIndex: -1, top: 0, width: "100%" }}>
                          <div style={{ position: "relative", margin: "-9px -16px" }}>
                            <div style={{ zIndex: 0, width: `${optionContainerWidth}%`, backgroundColor: "skyblue", height: "2.25em", borderRadius: "4px" }}></div>
                          </div>
                        </div>
                      </div>
                  </Box>
                  )
                })
              }
            </React.Fragment>
          )
        })
      }
    </Container>
  );
};

export default Result;