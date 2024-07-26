// Chat.js (React Component)
import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import useStore from '../../store';
import Swal from 'sweetalert2';
import { generateUniqueId } from 'utils/GenerateUUID';
// import './Chat.css';

const ClientChat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('chatRoom'); // Default room ID
    const [waitingListRoomId, setWaitingListRoomId] = useState('waitingListRoom'); // Default room ID
    const [customerName, setCustomerName] = useState("");
    const [concern, setConcern] = useState("");
    const messagesEndRef = useRef(null);
    const {
        loading,
        setLoading,
        data,
        error,
        fetchData,
        isClientConnected,
        setIsClientConnected,
    } = useStore();
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle sign-in logic here
        console.log("customerName:", customerName);
        console.log("concern:", concern);

        if (
            customerName != null &&
            customerName !== "" &&
            concern != null &&
            concern !== ""
        ) {
            setLoading(true);
            waitingListExecution();
        } else {
            Swal.fire({
                title: "Fields Required",
                text: "Fill up all fields",
                icon: "warning",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (event) => {
        setConcern(event.target.value);
    };

    const waitingListExecution = () => {

        const receiveWaitingListMessageRoomId = generateUniqueId();

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44321/waitinglisthub", {
                withCredentials: true,
                accessTokenFactory: () => {
                    // Provide access token if authenticated
                    return localStorage.getItem("accessToken");
                },
            })
            .withAutomaticReconnect()
            .build();

        // setConnection(newConnection);
        console.log("new connection: ", newConnection);
        newConnection
            .start()
            .then((result) => {
                console.log("Connected!");

                // Join the initial room
                newConnection
                    .invoke("InitializeWaitingListRoom", waitingListRoomId)
                    .then(() => {
                        // Method to run after joining the initial room
                        console.log("Joined the initial room successfully");
                        // Call your method here
                        sendWaitingListMessage(newConnection, receiveWaitingListMessageRoomId);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                newConnection.on("ReceivedAcceptWaitingMessage", (customerName, concern, WLMRoomId) => {

                    //connect to client chat
                    if (receiveWaitingListMessageRoomId === WLMRoomId) {

                        setLoading(false);
                        setIsClientConnected(true);
                        chatRoomExecution(WLMRoomId);
                    } else {



                    }

                });

                newConnection.onclose(() => {
                    // alert("Connection lost. Please try to reconnect.");
                });

                newConnection.onreconnecting(() => {
                    console.log("Attempting to reconnect...");
                });

                newConnection.onreconnected(() => {
                    console.log("Reconnected!");
                    // Reinitialize room or restore state as needed
                    newConnection
                        .invoke("InitializeWaitingListRoom", waitingListRoomId)
                        .catch((err) => console.error(err));
                });
            })
            .catch((e) => {
                console.log("Connection failed: ", e);
            });

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    };

    const chatRoomExecution = (WLMRoomId) => {
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
                newConnection.invoke('InitializeRoom', WLMRoomId)
                    .catch(err => console.error(err));

                newConnection.on('RoomInitialized', (WLMRoomId) => {
                    //pull data from BE and set the messages state last offset(last30MessageIndex, lastMessageIndex)
                    console.log(`Room initialized: ${WLMRoomId}`);
                    // Optionally handle room initialization response
                });

                newConnection.on('ReceiveMessage', (user, message) => {
                    setMessages(messages => [...messages, { user, message }]);
                    scrollToBottom();
                });

                newConnection.onclose(() => {
                    // alert("Connection lost. Please try to reconnect.");
                });

                newConnection.onreconnecting(() => {
                    console.log('Attempting to reconnect...');
                });

                newConnection.onreconnected(() => {
                    console.log('Reconnected!');
                    // Reinitialize room or restore state as needed
                    newConnection.invoke('InitializeRoom', WLMRoomId)
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
    }

    const sendWaitingListMessage = async (connection, WLMRoomId) => {

        if (connection && waitingListRoomId) {
            try {
                await connection.send('SendWaitingListMessage', waitingListRoomId, customerName, concern, WLMRoomId);

            } catch (e) {
                console.log(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    const sendMessage = async () => {

        if (connection && roomId) {
            try {
                await connection.send('SendMessage', roomId, user, message);
                setMessage('');
            } catch (e) {
                console.log(e);
            }
        } else {
            // alert('No connection to server yet.');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* if not yet connected to agent */}
            {
                !isClientConnected ? (
                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-md-4">
                                <h2 className="text-center">Connect with agent</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="customerName">Customer Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="customerName"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="concern">Concern {concern}</label>
                                        <select className="form-control" onChange={handleChange}>
                                            <option value="" selected>
                                                Select Concern Type
                                            </option>
                                            <option value="inquiry">Inquiry</option>
                                            <option value="other concerns">Other Concerns</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">
                                        Connect With AGENT
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="container mt-4">
                        <div className='row'>
                            <div className='col'>
                                <div className="card">
                                    <div className="card-body chat-container">
                                        <div className="chat-messages mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                                            {messages.map((msg, index) => (
                                                <div key={index} className="chat-message">
                                                    <strong>{msg.user}</strong>: {msg.message}
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <div className="chat-input">
                                            <div className="input-group mb-3">
                                                <input
                                                    type="text"
                                                    value={user}
                                                    onChange={e => setUser(e.target.value)}
                                                    placeholder="Name"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="input-group mb-3">
                                                {/* <input
                                            type="text"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Message"
                                            className="form-control"
                                        /> */}
                                                <textarea className='form-control' value={message} onChange={e => setMessage(e.target.value)} placeholder="Message"></textarea>
                                                <div className="input-group-append">

                                                </div>

                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <button onClick={sendMessage} className="btn btn-secondary">
                                                        End
                                                    </button>
                                                </div>
                                                <div className='col-md-4'></div>
                                                <div className='col-md-4'>
                                                    <button onClick={sendMessage} className="btn btn-primary">
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            }
        </>



    );
};

export default ClientChat;