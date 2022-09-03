import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { supabaseClient } from "../../App";

const initialState = {
  data: {
    pollName: '',
    voteToken: nanoid(),
    questions: [
      {
        id: nanoid(),
        value: '',
        options: [
          {
            id: nanoid(),
            value: '',
          },
          {
            id: nanoid(),
            value: '',
          },
        ],
      }
    ]
  }
}

export const pollSlice = createSlice({
  name: 'poll',
  initialState: initialState,
  reducers: {
    replacePoll (state, action) {
      state.data = action.payload.poll;
    },
    resetPoll (state) {
      state.data = initialState;
    }
  }
});

export const pollActions = pollSlice.actions;

export const fetchPoll = (id) => (dispatch) => {
  const fetchData = async () => {
    let { data } = await supabaseClient.from("poll").select("*, questions!questions_poll_id_fkey(*), options!options_poll_id_fkey(*)").eq("vote_token", id);
    data = data[0];
    data = {
      pollName: data.name,
      voteToken: data.vote_token,
      questions: data.questions.map(parsedQuestion => {
        return {
          id: parsedQuestion.id,
          value: parsedQuestion.value,
          options: data.options
                              .filter(option => option.question_id === parsedQuestion.id)
                              .map(option => ({id: option.id, value: option.value}))
        }
      })
    }
    dispatch(pollActions.replacePoll({ poll: data }));
  }

  try {
    fetchData();
  } catch (error) {
    console.error(error);
  }
}