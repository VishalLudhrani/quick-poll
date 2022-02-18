const CastVote = () => {

  const poll = {
    pollName: "Test",
    questions: [
      {
        value: "What's the best?",
        options: [
          {
            value: "Burger",
          },
          {
            value: "Pizza",
          },
          {
            value: "Salad",
          },
          {
            value: "Veggies",
          },
        ]
      },
      {
        value: "What's the worst?",
        options: [
          {
            value: "Yippee",
          },
          {
            value: "Maggi",
          },
          {
            value: "Raymen Noodles",
          },
        ]
      },
    ]
  }

  const voteHandler = e => {
    console.log(e.target.value);
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