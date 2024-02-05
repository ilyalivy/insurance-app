import { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';

const CompanyForm = () => {
    const [companiesList, setCompaniesList] = useState([]);

    // State for the Add Company form
    const [companyName, setCompanyName] = useState('');
    const [excelHeaders, setExcelHeaders] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phoneNumber: '',
        email: '',
        insuranceRate: '',
    });

    // State for the Edit Company form
    const [editCompanyName, setEditCompanyName] = useState('');
    const [editExcelHeaders, setEditExcelHeaders] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phoneNumber: '',
        email: '',
        insuranceRate: '',
    });

    // Additional state hooks for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const getCompaniesList = async () => {
        const companyFileStructuresRef = collection(
            db,
            'companyFileStructures'
        );
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

    useEffect(() => {
        getCompaniesList(); // Call this to get the companies
    }, []);

    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    };

    const handleHeaderChange = (key, event) => {
        setExcelHeaders({
            ...excelHeaders,
            [key]: event.target.value,
        });
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
            setCompaniesList(
                companiesList.filter((company) => company.id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const headerOrder = [
        'firstName',
        'lastName',
        'gender',
        'age',
        'phoneNumber',
        'email',
        'insuranceRate',
    ];

    const openUpdateForm = (company) => {
        setEditingCompany(company);
        setIsEditing(true);
        setEditCompanyName(company.companyName);

        // Assuming the fileStructure's keys are the headers' values to be edited
        const initialEditHeaders = {};
        headerOrder.forEach((header) => {
            const headerKey = Object.keys(company.fileStructure).find(
                (key) => company.fileStructure[key] === header
            );
            initialEditHeaders[header] = headerKey || '';
        });

        setEditExcelHeaders(initialEditHeaders);
    };

    const handleEditHeaderChange = (key, event) => {
        setEditExcelHeaders((prevHeaders) => ({
            ...prevHeaders,
            [key]: event.target.value,
        }));
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

    return (
        <div>
            {/* Company Form */}
            <form
                onSubmit={onAddCompany}
                className="bg-white rounded shadow-md p-6 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name of Company input on the first column */}
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Name of Company"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                    />
                    {/* Header for First Name input on the second column */}
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Header from Excel for FirstName"
                        value={excelHeaders.firstName}
                        onChange={(event) =>
                            handleHeaderChange('firstName', event)
                        }
                    />
                    {/* The rest of the header inputs */}
                    {Object.entries(excelHeaders)
                        .slice(1)
                        .map(([key, value]) => (
                            <input
                                key={key}
                                className="border-2 p-2 rounded"
                                type="text"
                                placeholder={`Header from Excel for ${
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                }`}
                                value={value}
                                onChange={(event) =>
                                    handleHeaderChange(key, event)
                                }
                            />
                        ))}
                </div>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Company
                </button>
            </form>
            {/* Update Company Form */}
            {isEditing && (
                <form
                    onSubmit={updateCompany}
                    className="bg-white rounded shadow-md p-6 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="border-2 p-2 rounded"
                            type="text"
                            placeholder="Name of Company"
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                        />
                        {Object.entries(editExcelHeaders).map(
                            ([key, value]) => (
                                <input
                                    key={key}
                                    className="border-2 p-2 rounded"
                                    type="text"
                                    placeholder={`Header from Excel for ${
                                        key.charAt(0).toUpperCase() +
                                        key.slice(1)
                                    }`}
                                    value={value}
                                    onChange={(event) =>
                                        handleEditHeaderChange(key, event)
                                    }
                                />
                            )
                        )}
                    </div>
                    <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </form>
            )}
            {/* Companies List */}
            <div className="bg-white rounded shadow-md p-6 overflow-x-auto mb-6">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                Name
                            </th>
                            {/* Generate static headers "Header 1", "Header 2", ..., "Header 7" */}
                            {[...Array(7)].map((_, index) => (
                                <th
                                    key={index}
                                    className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left whitespace-nowrap"
                                >
                                    {`Header ${index + 1}`}
                                </th>
                            ))}
                            <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {companiesList.map((company) => (
                            <tr key={company.id}>
                                <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                    {company.companyName}
                                </td>
                                {headerOrder.map((headerKey, index) => {
                                    // Find the value for each header
                                    const headerValue = Object.keys(
                                        company.fileStructure
                                    ).find(
                                        (key) =>
                                            company.fileStructure[key] ===
                                            headerKey
                                    );
                                    return (
                                        <td
                                            key={index}
                                            className="border-b border-gray-200 px-4 py-3"
                                        >
                                            {headerValue || ''}
                                        </td>
                                    );
                                })}
                                <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                    <button
                                        onClick={() => openUpdateForm(company)}
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            deleteCompany(company.id)
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
    );
};

export default CompanyForm;
