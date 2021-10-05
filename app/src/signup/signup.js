import React, { useContext, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import '../Login.css'

const SignUp = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationCode, setConfirmationCode] = useState(0);

    const validateForm = () => {
        return username.length > 0 && password.length > 0 && email.length > 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        authContext.signup(username, email, password)
        authContext.attributes()
    }

    const handleConfirmationCode = (e) => {
        e.preventDefault();
        authContext.confirmationCode(username, confirmationCode)
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Sign Up
                </Button>
            </Form>

            <Form onSubmit={handleConfirmationCode}>
                <Form.Group size="lg" controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="number"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Confirm
                </Button>
            </Form>
        </div>
    );
}

export default SignUp;

