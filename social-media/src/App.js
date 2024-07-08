import React from "react";
import Chat from "./Chat";
import "./App.css";
import ConnectionStatus from "./components/ConnectionStatus";
import YoutubeForm from "./components/YoutubeForm";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SignalR Chat</h1>
      </header>
      {/* <ConnectionStatus /> */}
      <YoutubeForm />
      {/* <Chat /> */}
    </div>
  );
};

export default App;
