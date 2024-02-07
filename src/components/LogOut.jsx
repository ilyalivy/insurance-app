import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { signOut } from 'firebase/auth';

const LogOut = () => {
    const navigate = useNavigate();

    const SignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <button
                onClick={SignOut}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Log Out
            </button>
        </div>
    );
};

export default LogOut;
