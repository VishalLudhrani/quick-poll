import { Input } from "@material-tailwind/react";
import PropTypes from "prop-types";

const NewPollForm = ({
  questions,
  onPollNameChange,
  onQuestionChange,
  onOptionChange,
  addOption,
  deleteOption
}) => {
  return (
    <div className="space-y-4"> {/* question element */}
      <div className="space-y-2"> {/* poll details */}
        <h4 className="text-xl font-bold">Set a suitable name for your poll:</h4>
        <Input
          type="text"
          label="Poll name"
          name="question"
          onChange={e => {onPollNameChange("pollName", e.target.value)}}
          className="w-full focus:ring-0" />
      </div>
      {
        questions.map((question, questionPos) => {
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
                      onChange={e => {onQuestionChange(e, questionPos)}}
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
                              onChange={e => onOptionChange(e, pos, questionPos)}
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