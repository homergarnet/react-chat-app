// Chat.js (React Component)
import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import Swal from 'sweetalert2';
import useStore from '../../store';
import { decodeToken } from 'utils/TokenHelpers';
// import './Chat.css';

const AgentChat = () => {
    const waitingListRoomId = "waitingListRoom";
    // const [connection, setConnection] = useState(null);

    const [connection, setConnection] = useState(null);
    const [connections, setConnections] = useState([]);
    const [messages, setMessages] = useState([]);
    const [concernList, setConcernList] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('chatRoom'); // Default room ID
    const messagesEndRef = useRef(null);
    const userId = decodeToken(localStorage.getItem('authToken'));
    const {
        waitingList,
        getWaitingList,
        updateWaitingList,
        waitingAccomodatedByList,
        getWaitingByCsrList,
        waitingAccomodatedByChange,
        setWaitingAccomodatedByChange
    } = useStore();

    useEffect(() => {
        getWaitingList("", 1, 1000);


        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44321/waitinglisthub", {
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
                newConnection
                    .invoke("InitializeWaitingListRoom", waitingListRoomId)
                    .then(() => {
                        // Method to run after joining the initial room
                        console.log("Joined the initial room successfully");
                        // Call your method here

                    })
                    .catch((err) => {
                        console.error(err);
                    });

                newConnection.on('ReceiveWaitingListMessage', (customerName, concern, WLMRoomId) => {
                    getWaitingList("", 1, 1000);
                    Swal.fire({
                        title: 'Accept or Decline',
                        text: `Do you want to accept or decline ${customerName}`,
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Accept',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //do nothing
                            acceptWaitingMessage(newConnection, waitingListRoomId, customerName, concern, WLMRoomId);
                        }
                    });
                    setConcernList(concernList => [...concernList, { customerName, concern }]);
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
                    newConnection.invoke('InitializeWaitingListRoom', waitingListRoomId)
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

    //connection for chat
    useEffect(() => {

        if (waitingAccomodatedByChange == true) {
            console.log("newwwwwwwwwww room ID: ", roomId)
            getWaitingByCsrList("", 1, 1000);
            setWaitingAccomodatedByChange(false);
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
            // connections.push(newConnection);
            setConnections(connections => [...connections, { newConnection }]);
            console.log("new connection: ", newConnection)
            newConnection.start()
                .then(result => {
                    console.log('Connected!');

                    // Join the initial room
                    newConnection.invoke('InitializeRoom', roomId)
                        .catch(err => console.error(err));

                    newConnection.on('RoomInitialized', (roomId) => {
                        //pull data from BE and set the messages state last offset(last30MessageIndex, lastMessageIndex)
                        console.log(`Room initialized: ${roomId}`);
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
        }

    }, [waitingAccomodatedByChange]);

    const sendMessage = async (chatMessageCount, WlroomId) => {

        console.log("WlroomId: ", WlroomId);

        if (connections[chatMessageCount] && WlroomId) {
            try {
                await connections[chatMessageCount].send('SendMessage', WlroomId, user, message);
                setMessage('');
            } catch (e) {
                console.log(e);
            }
        } else {
            // alert('No connection to server yet.');
        }
    };

    const acceptWaitingMessage = async (connection, roomId, customerName, concern, WLMRoomId) => {
        setRoomId(WLMRoomId);
        if (connection && roomId) {
            try {
                await connection.send('AcceptWaitingMessage', roomId, customerName, concern, WLMRoomId);
                await updateWaitingList(WLMRoomId, false, userId.UserId);
                await getWaitingList("", 1, 1000);
                setWaitingAccomodatedByChange(true);

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
        <div className="container mt-4">
            <div className='row'>
                <div className='col'>
                    <h2>Waiting List Count: {waitingList && waitingList?.length}</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Concern</th>
                                <th scope="col">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                waitingList && waitingList?.map((waitingList, index) => (
                                    <tr key={waitingList.WaitingListId}>
                                        <td>{waitingList.CustomerName}</td>
                                        <td>{waitingList.Concern}</td>
                                        <td><button className='btn btn-primary' type='button' onClick={() => acceptWaitingMessage(connection, waitingListRoomId, waitingList.CustomerName, waitingList.Concern, waitingList.WlroomId)}>Accept</button></td>
                                    </tr>
                                ))

                            }
                            {/* {concernList.map((concern, index) => (
                                <tr key={index}>

                                    <td>{concern.customerName}</td>
                                    <td>{concern.concern}</td>
                                    <td><button className='btn btn-primary' type='button'>Accept</button></td>
                                </tr>
                            ))} */}

                        </tbody>
                    </table>
                </div>
            </div>
            <div className='row'>
                {waitingAccomodatedByList && waitingAccomodatedByList?.map((waitingAccomodatedByList, index) => (
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

                                        <textarea className='form-control' value={message} onChange={e => setMessage(e.target.value)} placeholder="Message"></textarea>
                                        <div className="input-group-append">

                                        </div>

                                    </div>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <button onClick={() => sendMessage(index, waitingAccomodatedByList.WlroomId)} className="btn btn-secondary">
                                                End
                                            </button>
                                        </div>
                                        <div className='col-md-4'></div>
                                        <div className='col-md-4'>
                                            <button onClick={() => sendMessage(index, waitingAccomodatedByList.WlroomId)} className="btn btn-primary">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    );
};

export default AgentChat;