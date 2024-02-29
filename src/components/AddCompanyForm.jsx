const AddCompanyForm = ({
    onAddCompany,
    companyName,
    setCompanyName,
    excelHeaders,
    setExcelHeaders,
}) => {
    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    };

    const handleHeaderChange = (key, event) => {
        setExcelHeaders({
            ...excelHeaders,
            [key]: event.target.value,
        });
    };

    return (
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
                    onChange={(event) => handleHeaderChange('firstName', event)}
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
                            onChange={(event) => handleHeaderChange(key, event)}
                        />
                    ))}
            </div>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Company
            </button>
        </form>
    );
};

export default AddCompanyForm;
