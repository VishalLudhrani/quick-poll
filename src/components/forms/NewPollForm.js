import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import React from "react";

const NewPollForm = ({
  questions,
  onPollNameChange,
  onQuestionChange,
  onOptionChange,
  addOption,
  deleteOption
}) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>Poll Name:</Typography>
      <TextField
        placeholder="Enter a suitable poll name"
        name="question"
        size="small"
        fullWidth
        variant="standard"
        onChange={e => {onPollNameChange("pollName", e.target.value)}}
      />
      {
        questions.map((question, questionPos) => {
          return (
            <React.Fragment key={questionPos}>
              <Typography variant="h6" gutterBottom mt={4}>Question {questionPos + 1}:</Typography>
              <TextField
                placeholder="Write your question here"
                name="question" 
                size="small"
                fullWidth
                variant="standard"
                onChange={e => {onQuestionChange(e, questionPos)}}
                className="input input-bordered w-full" />
              <Typography variant="h6" mt={2}>Options:</Typography>
              {
                question.options.map((option, pos) => {
                  let inputElName = `option${pos + 1}`;
                  return (
                    <Grid container spacing={1} key={pos} alignItems="center" my={1}> {/* option element */}
                      <Grid item xs={1}>
                        <ion-icon name="radio-button-off-outline"></ion-icon>  
                      </Grid>
                      <Grid item xs={11}>
                        <TextField
                          name={inputElName}
                          onChange={e => onOptionChange(e, pos, questionPos)}
                          size="small"
                          variant="standard"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => deleteOption(pos, questionPos)}
                                  disabled={!(pos > 1)}
                                >
                                  <DeleteIcon fontSize="small" color={!(pos > 1) ? "inherit" : "error"} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                })
              }
              <Button 
                onClick={() => addOption(questionPos)}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add new option
              </Button>
            </React.Fragment>
          )
        })
      }
    </>
  )
}

NewPollForm.propTypes = {
  questions: PropTypes.array,
  onPollNameChange: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onOptionChange: PropTypes.func,
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
}

export default NewPollForm;