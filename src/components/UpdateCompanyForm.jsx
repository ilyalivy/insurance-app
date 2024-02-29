const UpdateCompanyForm = ({
    updateCompany,
    editCompanyName,
    setEditCompanyName,
    editExcelHeaders,
    setEditExcelHeaders,
}) => {
    const handleEditCompanyNameChange = (event) => {
        setEditCompanyName(event.target.value);
    };

    const handleEditHeaderChange = (key, event) => {
        setEditExcelHeaders((prevHeaders) => ({
            ...prevHeaders,
            [key]: event.target.value,
        }));
    };

    return (
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
                    onChange={handleEditCompanyNameChange}
                />
                {Object.entries(editExcelHeaders).map(([key, value]) => (
                    <input
                        key={key}
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder={`Header from Excel for ${
                            key.charAt(0).toUpperCase() + key.slice(1)
                        }`}
                        value={value}
                        onChange={(event) => handleEditHeaderChange(key, event)}
                    />
                ))}
            </div>
            <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Save
            </button>
        </form>
    );
};

export default UpdateCompanyForm;
