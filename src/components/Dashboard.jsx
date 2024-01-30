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

    // New state for company selection and expected columns
    const [selectedCompany, setSelectedCompany] = useState('');
    const [expectedColumns, setExpectedColumns] = useState({});

    // Mapping of companies to their expected Excel file structures
    const companyFileStructures = {
        'Company A': {
            'Customer Name': 'firstName',
            'Name Last': 'lastName',
            'Customer gender': 'gender',
            'Customer age': 'age',
            'Customer phone number': 'phoneNumber',
            'Customer e-mail': 'email',
            'Customer ins rate': 'insuranceRate',
        },
        'Company B': {
            'Name of customer': 'firstName',
        },
    };

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

    const onAddClient = async () => {
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

    const handleCompanySelection = (company) => {
        setSelectedCompany(company);
        setExpectedColumns(companyFileStructures[company] || {});
    };

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
        if (!selectedCompany) {
            console.error('No company selected.');
            alert('Please select a company before uploading an Excel file.');
            return;
        }

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

            const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log('Raw JSON data', rawJson);

            // The headers are in the second element of the array, which has an index of 1
            const headers = rawJson[1];
            console.log('Headers', headers);

            // Validate if the Excel file matches the selected company's expected structure
            const expectedHeaders = Object.keys(
                companyFileStructures[selectedCompany]
            );
            const isHeaderValid = expectedHeaders.every((header) =>
                headers.includes(header)
            );

            if (!isHeaderValid) {
                console.error(
                    'Excel file headers do not match the expected headers for the selected company.'
                );
                alert(
                    'The uploaded Excel file does not match the selected company’s format.'
                );
                return;
            }

            // Data starts from the third element in the array, which has an index of 2
            const dataRows = rawJson.slice(2);
            console.log('Data rows', dataRows);

            // Find the index of each column based on the headers
            const columnIndexes = {};
            headers.forEach((header, index) => {
                if (expectedColumns[header]) {
                    columnIndexes[expectedColumns[header]] = index;
                }
            });

            for (const data of dataRows) {
                if (data.length === 0) continue; // Skip empty rows

                const newDoc = {};
                for (const [field, index] of Object.entries(columnIndexes)) {
                    if (field === 'age') {
                        // Convert age to a number
                        newDoc[field] = parseInt(data[index], 10) || null; // Use null for non-numeric values
                    } else if (field === 'phoneNumber') {
                        // Convert phoneNumber to a string
                        newDoc[field] = data[index]
                            ? data[index].toString()
                            : '';
                    } else {
                        // Handle other fields as strings
                        newDoc[field] = data[index] || '';
                    }
                }

                newDoc['userId'] = auth.currentUser.uid;

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
                    <select
                        className="border-2 p-2 rounded mb-4"
                        value={selectedCompany}
                        onChange={(e) => handleCompanySelection(e.target.value)}
                    >
                        <option value="">Select Company</option>
                        <option value="Company A">Company A</option>
                        <option value="Company B">Company B</option>
                    </select>
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
                    {/* Client Form */}
                    <div className="bg-white rounded shadow-md p-6 mb-6">
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
                        <button
                            onClick={onAddClient}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Client
                        </button>
                    </div>
                    {/* Update Client Form */}
                    {showUpdateForm && (
                        <div className="bg-white rounded shadow-md p-6 mb-6">
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
                            <button
                                onClick={updateClient}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Save
                            </button>
                        </div>
                    )}
                    {/* Clients List */}
                    <div className="bg-white rounded shadow-md p-6 overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
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
                                        Email
                                    </th>
                                    <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                        Phone Number
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
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.firstName} {client.lastName}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.gender}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.age}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.email}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.phoneNumber}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
                                            {client.insuranceRate}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-3">
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
