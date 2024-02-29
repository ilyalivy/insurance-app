const CompaniesList = ({
    companiesList,
    deleteCompany,
    setEditCompanyName,
    setEditExcelHeaders,
    setIsEditing,
    setEditingCompany,
}) => {
    const headerOrder = [
        'firstName',
        'lastName',
        'gender',
        'age',
        'phoneNumber',
        'email',
        'insuranceRate',
    ];

    const openUpdateCompanyForm = (company) => {
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

    return (
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
                                        company.fileStructure[key] === headerKey
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
                                    onClick={() =>
                                        openUpdateCompanyForm(company)
                                    }
                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCompany(company.id)}
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
    );
};

export default CompaniesList;
