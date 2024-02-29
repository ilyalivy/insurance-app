import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CompanyForm from './CompanyForm';
import ClientForm from './ClientForm';

const Customers = () => {
    const [companiesList, setCompaniesList] = useState([]);
    const [clientsList, setClientsList] = useState([]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            {/* Main Content */}
            <main className="w-4/5">
                <Header
                    setClientsList={setClientsList}
                    showExcelUploader={true}
                />
                {/* Content */}
                <div className="container mx-auto px-4 pt-6">
                    <CompanyForm
                        companiesList={companiesList}
                        setCompaniesList={setCompaniesList}
                    />
                    <ClientForm
                        clientsList={clientsList}
                        setClientsList={setClientsList}
                    />
                </div>
            </main>
        </div>
    );
};

export default Customers;
