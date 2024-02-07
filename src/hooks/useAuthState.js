import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const useAuthState = (
    fetchAvatarUrl,
    getClientsList,
    setAvatarUrl,
    setClientsList
) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchAvatarUrl();
                getClientsList(); // Call this when the user is signed in
            } else {
                setAvatarUrl('');
                setClientsList([]); // Clear the list when the user signs out
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []);
};

export default useAuthState;
