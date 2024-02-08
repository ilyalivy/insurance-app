import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase-config';

const useFirestore = ({
    setClientsList,
    newClientData,
    setNewClientData,
    updateId,
    setUpdateId,
    updatedClientData,
    setUpdatedClientData,
    setShowUpdateForm,
}) => {
    
    const clientsCollectionRef = collection(db, 'clients');

    const getClientsList = async () => {
        const userUid = auth.currentUser.uid; // Get the current user's UID
        const queryConstraint = query(
            clientsCollectionRef,
            where('userId', '==', userUid)
        );
        try {
            const data = await getDocs(queryConstraint);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setClientsList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    const onAddClient = async (event) => {
        event.preventDefault();
        const clientData = {
            ...newClientData,
            age: parseInt(newClientData.age, 10),
            phoneNumber: newClientData.phoneNumber.toString(),
        };
        try {
            await addDoc(clientsCollectionRef, {
                ...clientData,
                userId: auth.currentUser.uid,
            });

            getClientsList();
            setNewClientData({
                firstName: '',
                lastName: '',
                gender: '',
                age: '',
                phoneNumber: '',
                email: '',
                insuranceRate: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteClient = async (id) => {
        const clientDoc = doc(db, 'clients', id);
        try {
            await deleteDoc(clientDoc);

            getClientsList();
        } catch (error) {
            console.error(error);
        }
    };

    const openUpdateForm = (client) => {
        setUpdateId(client.id);
        setUpdatedClientData({
            firstName: client.firstName,
            lastName: client.lastName,
            gender: client.gender,
            age: client.age,
            phoneNumber: client.phoneNumber,
            email: client.email,
            insuranceRate: client.insuranceRate,
        });

        setShowUpdateForm(true);
    };

    const updateClient = async (event) => {
        event.preventDefault();
        const updatedData = {
            ...updatedClientData,
            age: parseInt(updatedClientData.age, 10),
            phoneNumber: updatedClientData.phoneNumber.toString(),
        };
        const clientDoc = doc(db, 'clients', updateId);

        try {
            await updateDoc(clientDoc, updatedData);

            getClientsList();
            setShowUpdateForm(false);
            setUpdateId(null);

            setUpdatedClientData({
                firstName: '',
                lastName: '',
                gender: '',
                age: '',
                phoneNumber: '',
                email: '',
                insuranceRate: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return {
        getClientsList,
        onAddClient,
        deleteClient,
        openUpdateForm,
        updateClient,
        clientsCollectionRef,
    };
};

export default useFirestore;
