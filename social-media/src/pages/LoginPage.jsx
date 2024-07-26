import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuthContext from 'store/auth/useAuthContext';

const LoginPage = () => {
    const {
        regexBlackListedChars,
        getLoginStatus,
        loginStatus
    } = useAuthContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('123123Qq@');
    const navigate = useNavigate();
    const onChangeUsername = (e) => {
        const newValue = e.target.value;
        var regex = regexBlackListedChars;

        if (!regex.test(newValue)) {
            setUsername(newValue);
            return;
        }

        if (newValue.length >= 1) {

        }

    }

    const onKeyPressUsername = (e) => {
        var regex = regexBlackListedChars;
        var key = e.keyCode || e.which;
        key = String.fromCharCode(key);
        if (regex.test(key)) {
            e.returnValue = false;
            e.preventDefault();
        }
    }

    const onChangePassword = (e) => {
        const newValue = e.target.value;
        var regex = regexBlackListedChars;

        if (!regex.test(newValue)) {
            setPassword(newValue);
            return;
        }

        if (newValue.length >= 1) {

        }

    }

    const onKeyPressPassword = (e) => {
        var regex = regexBlackListedChars;
        var key = e.keyCode || e.which;
        key = String.fromCharCode(key);
        if (regex.test(key)) {
            e.returnValue = false;
            e.preventDefault();
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle sign-in logic here
        let loginStatus = await getLoginStatus(username, password, "");

        if(loginStatus == "login success") {
            navigate('/chat');
        } 
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="text-center">Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={onChangeUsername}
                                onKeyPress={onKeyPressUsername}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={onChangePassword}
                                onKeyPress={onKeyPressPassword}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage
