import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../config/firebase-config';
import { useEffect, useState } from 'react';
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

const Dashboard = () => {
    const navigate = useNavigate();

    const [clientsList, setClientsList] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    // New Clients States
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newGender, setNewGender] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newInsuranceRate, setNewInsuranceRate] = useState('');

    // Update Clients States
    const [updatedFirstName, setUpdatedFirstName] = useState('');
    const [updatedLastName, setUpdatedLastName] = useState('');
    const [updatedGender, setUpdatedGender] = useState('');
    const [updatedAge, setUpdatedAge] = useState('');
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedInsuranceRate, setUpdatedInsuranceRate] = useState('');

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getClientsList(); // Call this when the user is signed in
            } else {
                setClientsList([]); // Clear the list when the user signs out
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return unsubscribe;
    }, []);

    const onAddClient = async () => {
        try {
            await addDoc(clientsCollectionRef, {
                firstName: newFirstName,
                lastName: newLastName,
                gender: newGender,
                age: parseInt(newAge, 10),
                phoneNumber: parseInt(newPhoneNumber, 10),
                email: newEmail,
                insuranceRate: newInsuranceRate,
                userId: auth.currentUser.uid,
            });

            getClientsList();

            setNewFirstName('');
            setNewLastName('');
            setNewGender('');
            setNewAge('');
            setNewPhoneNumber('');
            setNewEmail('');
            setNewInsuranceRate('');
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
        setUpdatedFirstName(client.firstName);
        setUpdatedLastName(client.lastName);
        setUpdatedGender(client.gender);
        setUpdatedAge(client.age);
        setUpdatedPhoneNumber(client.phoneNumber);
        setUpdatedEmail(client.email);
        setUpdatedInsuranceRate(client.insuranceRate);

        setShowUpdateForm(true);
    };

    const updateClient = async () => {
        const clientDoc = doc(db, 'clients', updateId);
        try {
            await updateDoc(clientDoc, {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                gender: updatedGender,
                age: parseInt(updatedAge, 10),
                phoneNumber: parseInt(updatedPhoneNumber, 10),
                email: updatedEmail,
                insuranceRate: updatedInsuranceRate,
            });
            getClientsList();
            setShowUpdateForm(false);
            setUpdateId(null);

            setUpdatedFirstName('');
            setUpdatedLastName('');
            setUpdatedGender('');
            setUpdatedAge('');
            setUpdatedPhoneNumber('');
            setUpdatedEmail('');
            setUpdatedInsuranceRate('');
        } catch (error) {
            console.error(error);
        }
    };

    const LogOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <button onClick={LogOut}>Log Out</button>

            <div>
                <input
                    placeholder="First Name"
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                />
                <input
                    placeholder="Last Name"
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                />
                <input
                    placeholder="Gender"
                    type="text"
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                />
                <input
                    placeholder="Age"
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                />
                <input
                    placeholder="Phone Number"
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                <input
                    placeholder="Email"
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <select
                    value={newInsuranceRate}
                    onChange={(e) => setNewInsuranceRate(e.target.value)}
                >
                    <option value="">Select Insurance Rate</option>
                    <option value="Standard">Standard</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Premium">Premium</option>
                    <option value="Platinum">Platinum</option>
                </select>
                <button onClick={onAddClient}>Add Client</button>
            </div>

            <div>
                {showUpdateForm && (
                    <div>
                        <input
                            placeholder="First Name"
                            value={updatedFirstName}
                            onChange={(e) =>
                                setUpdatedFirstName(e.target.value)
                            }
                        />
                        <input
                            placeholder="Last Name"
                            value={updatedLastName}
                            onChange={(e) => setUpdatedLastName(e.target.value)}
                        />
                        <input
                            placeholder="Gender"
                            value={updatedGender}
                            onChange={(e) => setUpdatedGender(e.target.value)}
                        />
                        <input
                            placeholder="Age"
                            type="number"
                            value={updatedAge}
                            onChange={(e) => setUpdatedAge(e.target.value)}
                        />
                        <input
                            placeholder="Phone Number"
                            type="tel"
                            value={updatedPhoneNumber}
                            onChange={(e) =>
                                setUpdatedPhoneNumber(e.target.value)
                            }
                        />
                        <input
                            placeholder="Email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                        />
                        <select
                            value={updatedInsuranceRate}
                            onChange={(e) =>
                                setUpdatedInsuranceRate(e.target.value)
                            }
                        >
                            <option value="">Select Insurance Rate</option>
                            <option value="Standard">Standard</option>
                            <option value="Enhanced">Enhanced</option>
                            <option value="Premium">Premium</option>
                            <option value="Platinum">Platinum</option>
                        </select>

                        <button onClick={updateClient}>Save</button>
                    </div>
                )}
            </div>

            <div>
                {clientsList.map((client) => (
                    <div key={client.id}>
                        <p>{client.firstName}</p>
                        <p>{client.lastName}</p>
                        <p>{client.gender}</p>
                        <p>{client.age}</p>
                        <p>{client.phoneNumber}</p>
                        <p>{client.email}</p>
                        <p>{client.insuranceRate}</p>

                        <button onClick={() => openUpdateForm(client)}>
                            Update Client
                        </button>
                        <button onClick={() => deleteClient(client.id)}>
                            Delete Client
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
