import { auth, db } from '../config/firebase-config';
import { useState } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import Header from './Header';
import CompanyForm from './CompanyForm';
import ClientForm from './ClientForm';
import useAuthState from '../hooks/useAuthState';

const Dashboard = () => {
    const [clientsList, setClientsList] = useState([]);

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

    useAuthState(getClientsList, setClientsList);

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

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            {/* Main Content */}
            <main className="w-4/5">
                <Header
                    handleExcelFileInputChange={handleExcelFileInputChange}
                />
                {/* Content */}
                <div className="container mx-auto px-4 pt-6">
                    <CompanyForm />
                    <ClientForm
                        clientsList={clientsList}
                        setClientsList={setClientsList}
                    />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
