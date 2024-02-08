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
    setCompaniesList,
    companyName,
    setCompanyName,
    excelHeaders,
    setExcelHeaders,
    editCompanyName,
    setEditCompanyName,
    editExcelHeaders,
    setEditExcelHeaders,
    setIsEditing,
    editingCompany,
    setEditingCompany,

    setClientsList,
    newClientData,
    setNewClientData,
    updateId,
    setUpdateId,
    updatedClientData,
    setUpdatedClientData,
    setShowUpdateForm,
}) => {
    
    const companyFileStructuresRef = collection(db, 'companyFileStructures');

    const getCompaniesList = async () => {
        try {
            const data = await getDocs(companyFileStructuresRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setCompaniesList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    const onAddCompany = async (event) => {
        event.preventDefault();
        const companyFileStructuresRef = collection(
            db,
            'companyFileStructures'
        );

        // Create a mapping object for Firestore, skipping empty header names
        const firestoreStructure = {};
        for (const [key, value] of Object.entries(excelHeaders)) {
            if (key.trim() !== '' && value.trim() !== '') {
                // Only add the entry if both the key and value are not empty
                firestoreStructure[value.trim()] = key;
            }
        }

        // Check if the structure is empty
        if (Object.keys(firestoreStructure).length === 0) {
            console.error('Cannot add empty file structure.');
            return;
        }

        try {
            await addDoc(companyFileStructuresRef, {
                companyName: companyName,
                fileStructure: firestoreStructure,
            });

            getCompaniesList();

            setCompanyName('');
            setExcelHeaders({
                firstName: '',
                lastName: '',
                gender: '',
                age: '',
                phoneNumber: '',
                email: '',
                insuranceRate: '',
            });
        } catch (error) {
            console.error('Error adding company file structure: ', error);
        }
    };

    const deleteCompany = async (id) => {
        const companyDocRef = doc(db, 'companyFileStructures', id);
        try {
            await deleteDoc(companyDocRef);
            getCompaniesList();
        } catch (error) {
            console.error(error);
        }
    };

    const updateCompany = async (event) => {
        event.preventDefault();
        const companyDocRef = doc(
            db,
            'companyFileStructures',
            editingCompany.id
        );

        const updatedStructure = Object.entries(editExcelHeaders).reduce(
            (acc, [header, value]) => {
                if (value.trim() !== '') {
                    acc[value.trim()] = header;
                }
                return acc;
            },
            {}
        );

        try {
            await updateDoc(companyDocRef, {
                companyName: editCompanyName,
                fileStructure: updatedStructure,
            });

            getCompaniesList();
            setIsEditing(false);
            setEditingCompany(null);

            setEditCompanyName('');
            setEditExcelHeaders({
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
        getCompaniesList,
        onAddCompany,
        deleteCompany,
        updateCompany,
        companyFileStructuresRef,
        getClientsList,
        onAddClient,
        deleteClient,
        updateClient,
        clientsCollectionRef,
    };
};

export default useFirestore;
