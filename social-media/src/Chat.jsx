// Chat.js (React Component)
import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import './Chat.css';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('defaultRoom'); // Default room ID
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44321/chathub", {
                withCredentials: true,
                accessTokenFactory: () => {
                    // Provide access token if authenticated
                    return localStorage.getItem('accessToken');
                }
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        console.log("new connection: ", newConnection)
        newConnection.start()
            .then(result => {
                console.log('Connected!');

                // Join the initial room
                newConnection.invoke('InitializeRoom', roomId)
                    .catch(err => console.error(err));

                newConnection.on('RoomInitialized', (roomId) => {
                    console.log(`Room initialized: ${roomId}`);
                    // Optionally handle room initialization response
                });

                newConnection.on('ReceiveMessage', (user, message) => {
                    setMessages(messages => [...messages, { user, message }]);
                    console.log("setMessages: ", messages)
                    scrollToBottom();
                });

                newConnection.onclose(() => {
                    alert("Connection lost. Please try to reconnect.");
                });

                newConnection.onreconnecting(() => {
                    console.log('Attempting to reconnect...');
                });

                newConnection.onreconnected(() => {
                    console.log('Reconnected!');
                    // Reinitialize room or restore state as needed
                    newConnection.invoke('InitializeRoom', roomId)
                        .catch(err => console.error(err));
                });
            })
            .catch(e => {
                console.log('Connection failed: ', e);
            });

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    const sendMessage = async () => {
        if (connection && roomId) {
            try {
                await connection.send('SendMessage', roomId, user, message);
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
            {JSON.stringify(messages)}
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