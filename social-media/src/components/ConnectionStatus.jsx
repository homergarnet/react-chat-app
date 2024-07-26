import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
const ConnectionStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:44321/chathub", {
                    withCredentials: true
                })
                .withAutomaticReconnect()
                .build();
            // alert(newConnection._connectionStarted);
            setIsOnline(true);
        }
        const handleOffline = () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:44321/chathub", {
                    withCredentials: true
                })
                .withAutomaticReconnect()
                .build();
            // alert(newConnection._connectionStarted);
            setIsOnline(false)
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div>
            {!isOnline && (
                <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
                    You are currently offline. Please check your internet connection.
                </div>
            )}
        </div>
    );
};

export default ConnectionStatus;