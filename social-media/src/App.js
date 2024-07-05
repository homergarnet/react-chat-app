import React from "react";
import Chat from "./Chat";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SignalR Chat</h1>
      </header>
      <Chat />
    </div>
  );
};

export default App;
