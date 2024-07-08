import React from "react";
import Chat from "./Chat";
import "./App.css";
import ConnectionStatus from "./components/ConnectionStatus";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SignalR Chat</h1>
      </header>
      {/* <ConnectionStatus /> */}
      <Chat />
    </div>
  );
};

export default App;
