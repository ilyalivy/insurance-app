import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../config/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    setDoc,
    getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as XLSX from 'xlsx';
import CompanyForm from './CompanyForm';

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

    // File Upload State
    const [fileUpload, setFileUpload] = useState(null);

    // Avatar URL State
    const [avatarUrl, setAvatarUrl] = useState('');

    const clientsCollectionRef = collection(db, 'clients');

    const fileInputRef = useRef(null);

    const excelFileInputRef = useRef(null);

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

    const fetchAvatarUrl = async () => {
        if (auth.currentUser) {
            const userDocRef = doc(db, 'userProfiles', auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                setAvatarUrl(userDocSnap.data().avatarUrl);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchAvatarUrl();
                getClientsList(); // Call this when the user is signed in
            } else {
                setAvatarUrl('');
                setClientsList([]); // Clear the list when the user signs out
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return unsubscribe;
    }, []);

    const onAddClient = async (event) => {
        event.preventDefault();
        try {
            await addDoc(clientsCollectionRef, {
                firstName: newFirstName,
                lastName: newLastName,
                gender: newGender,
                age: parseInt(newAge, 10),
                phoneNumber: newPhoneNumber.toString(),
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

    const updateClient = async (event) => {
        event.preventDefault();
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

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileUpload(file);
        }
    };

    const uploadFile = async () => {
        if (!fileUpload) return;

        const storageRef = ref(
            storage,
            `avatars/${auth.currentUser.uid}/${fileUpload.name}`
        );
        try {
            const snapshot = await uploadBytes(storageRef, fileUpload);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setAvatarUrl(downloadURL);

            // Saving URLs in Firestore in a user document
            const userDocRef = doc(db, 'userProfiles', auth.currentUser.uid);
            await setDoc(
                userDocRef,
                { avatarUrl: downloadURL },
                { merge: true }
            );

            console.log('Uploaded file and got download URL:', downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        if (fileUpload) {
            uploadFile();
        }
    }, [fileUpload]);

    const handleExcelFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Process the Excel file
            processExcelFile(file);
        }
        // Clear the value of the input after processing
        e.target.value = null;
    };

    const processExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, {
                type: 'binary',
                cellDates: true,
                dateNF: 'yyyy-mm-dd',
            });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // Get data and headers directly from worksheet instead of using sheet_to_json
            const data = XLSX.utils.sheet_to_json(worksheet, {
                header: 1, // Receive data as an array of arrays
                blankrows: false, // Ignore empty lines
            });

            // The first line contains the headers
            const headers = data[0].filter((header) => header != null);

            console.log('Headers', headers);

            // Fetch company file structures from Firestore
            const companyFileStructuresRef = collection(
                db,
                'companyFileStructures'
            );
            const companyStructuresSnap = await getDocs(
                companyFileStructuresRef
            );

            // Convert the snapshot to a map of company names to their structures
            const companyStructuresMap = companyStructuresSnap.docs.reduce(
                (acc, doc) => {
                    const data = doc.data();
                    acc[data.companyName] = data.fileStructure;
                    return acc;
                },
                {}
            );

            // Output file structures obtained from Firestore
            console.log(
                'Company Structures from Firestore:',
                companyStructuresMap
            );

            // Auto-detection of the company format
            let detectedCompany = null;
            let expectedColumns = {};

            for (const [company, structure] of Object.entries(
                companyStructuresMap
            )) {
                // Convert structure from Firestore format back to local format
                const structureConverted = Object.fromEntries(
                    Object.entries(structure).map(
                        ([excelHeader, fieldName]) => [fieldName, excelHeader]
                    )
                );

                const expectedHeaders = Object.values(structureConverted);
                const isHeaderValid = expectedHeaders.every((header) =>
                    headers.includes(header)
                );

                if (isHeaderValid) {
                    detectedCompany = company;
                    expectedColumns = structureConverted;
                    break;
                }
            }

            // Output the converted file structure
            console.log(
                `Structure for detected company (${detectedCompany}):`,
                expectedColumns
            );

            if (!detectedCompany) {
                console.error(
                    'Unable to detect the company from the Excel file.'
                );
                alert(
                    'The format of the uploaded Excel file is not recognized.'
                );
                return;
            }

            console.log(`Detected company: ${detectedCompany}`);

            // Data starts from the third element in the array, which has an index of 2
            const dataRows = data.slice(1);
            console.log('Data rows', dataRows);

            // Next we use headers to create columnIndexes
            const columnIndexes = {};
            headers.forEach((header, index) => {
                const fieldName = Object.keys(expectedColumns).find(
                    (key) => expectedColumns[key] === header
                );
                if (fieldName) {
                    columnIndexes[fieldName] = index;
                }
            });

            console.log('Column indexes based on headers:', columnIndexes);

            for (const rowData of dataRows) {
                if (rowData.length === 0) continue; // Skip empty lines

                const newDoc = {
                    userId: auth.currentUser.uid, // This field is common to everyone
                    // Default values for all other fields
                    firstName: '',
                    lastName: '',
                    gender: '',
                    age: '',
                    phoneNumber: '',
                    email: '',
                    insuranceRate: '',
                };
                for (const [fieldName, columnIndex] of Object.entries(
                    columnIndexes
                )) {
                    // Since these data rows are an array with one element in the video object,
                    // where the key object corresponds to the column index, the result is accessed through this key.
                    // So we need to use Object.values(rowData)[columnIndex] to get the values.
                    const cellValue = Object.values(rowData)[columnIndex];
                    newDoc[fieldName] =
                        cellValue != null ? cellValue.toString() : '';
                }

                // Log the document to be added to Firestore
                console.log('New Document', newDoc);

                try {
                    await addDoc(clientsCollectionRef, newDoc);
                } catch (error) {
                    console.error('Error adding document:', error);
                }
            }

            getClientsList(); // Refresh the client list
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
        };

        reader.readAsBinaryString(file);
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
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/5 bg-black text-white shadow-md">
                <div className="pl-10 pt-20 flex flex-col justify-between h-full">
                    <nav>
                        <ul>
                            <li className="p-3 hover:bg-gray-500">
                                <a href="/dashboard">Dashboard</a>
                            </li>
                            <li className="p-3 hover:bg-gray-500">
                                <a href="/dashboard">Customers</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            {/* Main Content */}
            <main className="w-4/5">
                {/* Header */}
                <div className="bg-white p-6 shadow-md flex justify-between items-center h-24">
                    <div>
                        <h1 className="inline text-3xl font-bold text-gray-900 mr-6">
                            Ins App
                        </h1>
                    </div>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="inline-block h-20 w-20 rounded-full mr-4"
                            />
                        ) : (
                            <div className="hover:text-blue-700 text-blue-500 font-bold py-2 px-4 rounded">
                                Add photo
                            </div>
                        )}
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        hidden
                    />
                    <input
                        type="file"
                        ref={excelFileInputRef}
                        onChange={handleExcelFileInputChange}
                        accept=".xlsx, .xls"
                        hidden
                    />
                    <button onClick={() => excelFileInputRef.current.click()}>
                        Upload Excel File
                    </button>
                    <button
                        onClick={LogOut}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Log Out
                    </button>
                </div>
                {/* Content */}
                <div className="container mx-auto px-4 pt-6">
                    <CompanyForm />
                    {/* Client Form */}
                    <form
                        onSubmit={onAddClient}
                        className="bg-white rounded shadow-md p-6 mb-6"
                    >
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder="First name"
                                value={newFirstName}
                                onChange={(e) =>
                                    setNewFirstName(e.target.value)
                                }
                            />
                            <input
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder="Last name"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                            />
                            <input
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder="Gender"
                                value={newGender}
                                onChange={(e) => setNewGender(e.target.value)}
                            />
                            <input
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder="Age"
                                value={newAge}
                                onChange={(e) => setNewAge(e.target.value)}
                            />
                        </div>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder="Phone Number"
                                value={newPhoneNumber}
                                onChange={(e) =>
                                    setNewPhoneNumber(e.target.value)
                                }
                            />
                            <input
                                className="border-2 p-2 rounded"
                                type="email"
                                placeholder="Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <select
                                className="border-2 p-2 rounded"
                                value={newInsuranceRate}
                                onChange={(e) =>
                                    setNewInsuranceRate(e.target.value)
                                }
                            >
                                <option value="">Select Insurance Rate</option>
                                <option value="Standard">Standard</option>
                                <option value="Enhanced">Enhanced</option>
                                <option value="Premium">Premium</option>
                                <option value="Platinum">Platinum</option>
                            </select>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Client
                        </button>
                    </form>
                    {/* Update Client Form */}
                    {showUpdateForm && (
                        <form
                            onSubmit={updateClient}
                            className="bg-white rounded shadow-md p-6 mb-6"
                        >
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    className="border-2 p-2 rounded"
                                    type="text"
                                    placeholder="First Name"
                                    value={updatedFirstName}
                                    onChange={(e) =>
                                        setUpdatedFirstName(e.target.value)
                                    }
                                />
                                <input
                                    className="border-2 p-2 rounded"
                                    type="text"
                                    placeholder="Last Name"
                                    value={updatedLastName}
                                    onChange={(e) =>
                                        setUpdatedLastName(e.target.value)
                                    }
                                />
                                <input
                                    className="border-2 p-2 rounded"
                                    type="text"
                                    placeholder="Gender"
                                    value={updatedGender}
                                    onChange={(e) =>
                                        setUpdatedGender(e.target.value)
                                    }
                                />
                                <input
                                    className="border-2 p-2 rounded"
                                    type="number"
                                    placeholder="Age"
                                    value={updatedAge}
                                    onChange={(e) =>
                                        setUpdatedAge(e.target.value)
                                    }
                                />
                            </div>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    className="border-2 p-2 rounded"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={updatedPhoneNumber}
                                    onChange={(e) =>
                                        setUpdatedPhoneNumber(e.target.value)
                                    }
                                />
                                <input
                                    className="border-2 p-2 rounded"
                                    type="email"
                                    placeholder="Email"
                                    value={updatedEmail}
                                    onChange={(e) =>
                                        setUpdatedEmail(e.target.value)
                                    }
                                />
                                <select
                                    className="border-2 p-2 rounded"
                                    value={updatedInsuranceRate}
                                    onChange={(e) =>
                                        setUpdatedInsuranceRate(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Insurance Rate
                                    </option>
                                    <option value="Standard">Standard</option>
                                    <option value="Enhanced">Enhanced</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Save
                            </button>
                        </form>
                    )}
                    {/* Clients List */}
                    <div className="bg-white rounded shadow-md p-6 overflow-x-auto mb-6">
                        <table className="min-w-full leading-normal">
                            <thead className="whitespace-nowrap">
                                <tr>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Name
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Gender
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Age
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Phone Number
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Email
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Insurance Rate
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientsList.map((client) => (
                                    <tr key={client.id}>
                                        <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                            {client.firstName} {client.lastName}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.gender}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.age}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.phoneNumber}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.email}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.insuranceRate}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    openUpdateForm(client)
                                                }
                                                className="text-blue-600 hover:text-blue-800 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteClient(client.id)
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
