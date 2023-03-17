import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';


const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    function handleLogin(ev) {
        ev.preventDefault();
        axios.post(`http://localhost:4000/login`, { username, password }, { withCredentials: true })
            .then(response => {
                setUsername('');
                setPassword('');
                setUserInfo(response.data)
                setRedirect(true);
            })
            .catch(error => {
                console.log(error);
                alert("Wrong Credentials");
            });
    }

    if (redirect) {
        return <Navigate to='/' />;
    }
    return (
        <div className="wrapper">
            <h1>Welcome !</h1>
            <form onSubmit={handleLogin}>
                <input value={username} onChange={(ev) => setUsername(ev.target.value)} type="text" placeholder="Enter username" />
                <input value={password} onChange={(ev) => setPassword(ev.target.value)} type="password" placeholder="Password" />
                <closeform></closeform>
                <button type="submit">Login</button>
            </form>
            <p className="or">
                ----- or continue with -----
            </p>
            <div className="not-member">
                Not a member ? <Link to="/register">Register Now</Link>
            </div>
        </div>
    )
}

export default LoginPage