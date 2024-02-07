import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase-config';
import useAuthState from './useAuthState';

const useAvatar = () => {
    // File Upload State
    const [fileUpload, setFileUpload] = useState(null);

    // Avatar URL State
    const [avatarUrl, setAvatarUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileUpload(file);
        }
    };

    const uploadAvatar = async () => {
        if (!fileUpload || !auth.currentUser) {
            return;
        }

        try {
            const storageRef = ref(
                storage,
                `avatars/${auth.currentUser.uid}/${fileUpload.name}`
            );
            const snapshot = await uploadBytes(storageRef, fileUpload);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Saving URLs in Firestore in a user document
            const userDocRef = doc(db, 'userProfiles', auth.currentUser.uid);
            await setDoc(
                userDocRef,
                { avatarUrl: downloadURL },
                { merge: true }
            );

            setAvatarUrl(downloadURL);
            setFileUpload(null);
        } catch (err) {
            console.error('Error uploading avatar:', err);
        }
    };

    useEffect(() => {
        if (fileUpload) {
            uploadAvatar();
        }
    }, [fileUpload]);

    const fetchAvatarUrl = async () => {
        if (auth.currentUser) {
            const userDocRef = doc(db, 'userProfiles', auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                setAvatarUrl(userDocSnap.data().avatarUrl || '');
            }
        }
    };

    useAuthState(fetchAvatarUrl, setAvatarUrl);

    return { handleFileChange, avatarUrl };
};

export default useAvatar;
