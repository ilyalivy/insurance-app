import { useState } from 'react';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const CompanyForm = () => {
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

    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    };

    const handleHeaderChange = (key, event) => {
        setExcelHeaders({
            ...excelHeaders,
            [key]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
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

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 mb-6">
        {/* Grid container for the inputs with 2 columns */}
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
                onChange={(event) => handleHeaderChange('firstName', event)}
            />
            {/* The rest of the header inputs */}
            {Object.entries(excelHeaders).slice(1).map(([key, value]) => (
                <input
                    key={key}
                    className="border-2 p-2 rounded"
                    type="text"
                    placeholder={`Header from Excel for ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    value={value}
                    onChange={(event) => handleHeaderChange(key, event)}
                />
            ))}
        </div>
        {/* Submit button */}
        <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Add Company
        </button>
    </form>
    
    );
};

export default CompanyForm;
