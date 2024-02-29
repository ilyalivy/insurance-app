const ClientsList = ({
    clientsList,
    deleteClient,
    setUpdateId,
    setUpdatedClientData,
    setShowUpdateForm,
}) => {
    const openUpdateClientForm = (client) => {
        setUpdateId(client.id);
        setUpdatedClientData({
            firstName: client.firstName,
            lastName: client.lastName,
            gender: client.gender,
            age: client.age,
            phoneNumber: client.phoneNumber,
            email: client.email,
            insuranceRate: client.insuranceRate,
        });

        setShowUpdateForm(true);
    };

    return (
        <div className="bg-white rounded shadow-md p-6 overflow-x-auto mb-6">
            <table className="min-w-full leading-normal">
                <thead className="whitespace-nowrap">
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
                            Phone Number
                        </th>
                        <th className="border-b border-gray-200 text-gray-800 px-4 py-3 text-left">
                            Email
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
                    {clientsList &&
                        clientsList.map((client) => (
                            <tr key={client.id}>
                                <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                    {client.firstName} {client.lastName}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3">
                                    {client.gender}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3">
                                    {client.age}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3">
                                    {client.phoneNumber}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3">
                                    {client.email}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3">
                                    {client.insuranceRate}
                                </td>
                                <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                                    <button
                                        onClick={() =>
                                            openUpdateClientForm(client)
                                        }
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteClient(client.id)}
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

export default ClientsList;
