import React, { useState } from 'react'
import axios from 'axios';
import { Link} from 'react-router-dom';

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);

    function handleRegister(ev) {
        ev.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            setShowValidationError(true);
            return;
        }
        axios.post(`http://localhost:4000/register`, { username, password })
            .then(response => {
                setUsername('');
                setPassword('');
                setSuccess(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (success) {
        return (
            <div className="wrapper">
                <h1>Your registration was successful!</h1>
                <p>Please log in using your new credentials.</p>
                <Link to="/login" className='modal-btn'>
                    <button>Go to Login</button>
                </Link>
            </div>
        )
    }

    return (
        <div className="wrapper">
            <h1>Welcome!</h1>
            <form onSubmit={handleRegister}>
                <input value={username} onChange={(ev) => setUsername(ev.target.value)} type="text" placeholder="Enter username" />
                <input value={password} onChange={(ev) => setPassword(ev.target.value)} type="password" placeholder="Password" />
                {showValidationError && <p>Please fill in all the input fields.</p>}
                <button type="submit">Register</button>
            </form>
            <p className="or">
                ----- or continue with -----
            </p>
            <div className="not-member">
                Already a user ? <Link to="/login">Login Now</Link>
            </div>
        </div>
    )
}

export default RegisterPage;
