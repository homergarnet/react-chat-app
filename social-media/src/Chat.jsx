import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import './Chat.css';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {

        //for secured hub
        // const token = "yourToken"; 

        // const newConnection = new signalR.HubConnectionBuilder()
        //     .withUrl("https://localhost:44321/chathub", {
        //         accessTokenFactory: () => token,
        //         withCredentials: true
        //     })
        //     .withAutomaticReconnect()
        //     .build();
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44321/chathub", {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', (user, message) => {
                        setMessages(messages => [...messages, { user, message }]);
                        scrollToBottom();
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection._connectionStarted) {
            try {
                await connection.send('SendMessage', user, message);
                setMessage('');
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;