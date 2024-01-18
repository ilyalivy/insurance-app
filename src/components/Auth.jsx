import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signUp}>Sign Up</button>
            <button onClick={signIn}>Sign In</button>
        </div>
    );
};

export default Auth;
