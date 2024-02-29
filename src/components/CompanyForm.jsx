import { useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import AddCompanyForm from './AddCompanyForm';
import UpdateCompanyForm from './UpdateCompanyForm';
import CompaniesList from './CompaniesList';

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

    return (
        <div>
            <AddCompanyForm
                onAddCompany={onAddCompany}
                companyName={companyName}
                setCompanyName={setCompanyName}
                excelHeaders={excelHeaders}
                setExcelHeaders={setExcelHeaders}
            />
            {isEditing && (
                <UpdateCompanyForm
                    updateCompany={updateCompany}
                    editCompanyName={editCompanyName}
                    setEditCompanyName={setEditCompanyName}
                    editExcelHeaders={editExcelHeaders}
                    setEditExcelHeaders={setEditExcelHeaders}
                />
            )}
            <CompaniesList
                companiesList={companiesList}
                deleteCompany={deleteCompany}
                setEditCompanyName={setEditCompanyName}
                setEditExcelHeaders={setEditExcelHeaders}
                setIsEditing={setIsEditing}
                setEditingCompany={setEditingCompany}
            />
        </div>
    );
};

export default CompanyForm;
