import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setchatHistory] = useState([]);

  const surpriseOptions = [
    "What is the full form of BMI?",
    "What is the difference between active calories and total calories burined ?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! please ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setchatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          part: value,
        },
        {
          role: "ChatBot",
          part: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! please try again later.");
    }
  };

  const clear = () => {
    setValue = "";
    setError = "";
    setchatHistory([]);
  };
  return (
    <div className="app">
      <h1>Medical ChatBot</h1>
      <p>
        {" "}
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Suggestions
        </button>
      </p>

      <div className="input-container">
        <input
          value={value}
          placeholder="Search"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me </button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role} : {chatItem.part}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
