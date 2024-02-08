import { useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';

const CompanyForm = ({ companiesList, setCompaniesList }) => {
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

    const { getCompaniesList, onAddCompany, deleteCompany, updateCompany } =
        useFirestore({
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
        });

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
