import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import useAuthState from '../hooks/useAuthState';

const ClientForm = ({clientsList, setClientsList}) => {
   
    const [newClientData, setNewClientData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phoneNumber: '',
        email: '',
        insuranceRate: '',
    });
    const [updateId, setUpdateId] = useState(null);
    const [updatedClientData, setUpdatedClientData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phoneNumber: '',
        email: '',
        insuranceRate: '',
    });
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const {
        getClientsList,
        onAddClient,
        deleteClient,
        openUpdateForm,
        updateClient,
    } = useFirestore({
        setClientsList,
        newClientData,
        setNewClientData,
        updateId,
        setUpdateId,
        updatedClientData,
        setUpdatedClientData,
        setShowUpdateForm,
    });

    useAuthState(getClientsList, setClientsList);

    return (
        <div>
            {/* Client Form */}
            <form
                onSubmit={onAddClient}
                className="bg-white rounded shadow-md p-6 mb-6"
            >
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="First name"
                        value={newClientData.firstName}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                firstName: e.target.value,
                            })
                        }
                    />
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Last name"
                        value={newClientData.lastName}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                lastName: e.target.value,
                            })
                        }
                    />
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Gender"
                        value={newClientData.gender}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                gender: e.target.value,
                            })
                        }
                    />
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Age"
                        value={newClientData.age}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                age: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="border-2 p-2 rounded"
                        type="text"
                        placeholder="Phone Number"
                        value={newClientData.phoneNumber}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                phoneNumber: e.target.value,
                            })
                        }
                    />
                    <input
                        className="border-2 p-2 rounded"
                        type="email"
                        placeholder="Email"
                        value={newClientData.email}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                email: e.target.value,
                            })
                        }
                    />
                    <select
                        className="border-2 p-2 rounded"
                        value={newClientData.insuranceRate}
                        onChange={(e) =>
                            setNewClientData({
                                ...newClientData,
                                insuranceRate: e.target.value,
                            })
                        }
                    >
                        <option value="">Select Insurance Rate</option>
                        <option value="Standard">Standard</option>
                        <option value="Enhanced">Enhanced</option>
                        <option value="Premium">Premium</option>
                        <option value="Platinum">Platinum</option>
                    </select>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Client
                </button>
            </form>
            {/* Update Client Form */}
            {showUpdateForm && (
                <form
                    onSubmit={updateClient}
                    className="bg-white rounded shadow-md p-6 mb-6"
                >
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            className="border-2 p-2 rounded"
                            type="text"
                            placeholder="First Name"
                            value={updatedClientData.firstName}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    firstName: e.target.value,
                                })
                            }
                        />
                        <input
                            className="border-2 p-2 rounded"
                            type="text"
                            placeholder="Last Name"
                            value={updatedClientData.lastName}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    lastName: e.target.value,
                                })
                            }
                        />
                        <input
                            className="border-2 p-2 rounded"
                            type="text"
                            placeholder="Gender"
                            value={updatedClientData.gender}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    gender: e.target.value,
                                })
                            }
                        />
                        <input
                            className="border-2 p-2 rounded"
                            type="number"
                            placeholder="Age"
                            value={updatedClientData.age}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    age: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            className="border-2 p-2 rounded"
                            type="tel"
                            placeholder="Phone Number"
                            value={updatedClientData.phoneNumber}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    phoneNumber: e.target.value,
                                })
                            }
                        />
                        <input
                            className="border-2 p-2 rounded"
                            type="email"
                            placeholder="Email"
                            value={updatedClientData.email}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    email: e.target.value,
                                })
                            }
                        />
                        <select
                            className="border-2 p-2 rounded"
                            value={updatedClientData.insuranceRate}
                            onChange={(e) =>
                                setUpdatedClientData({
                                    ...updatedClientData,
                                    insuranceRate: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Insurance Rate</option>
                            <option value="Standard">Standard</option>
                            <option value="Enhanced">Enhanced</option>
                            <option value="Premium">Premium</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </form>
            )}
            {/* Clients List */}
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
                                                openUpdateForm(client)
                                            }
                                            className="text-blue-600 hover:text-blue-800 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteClient(client.id)
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

export default ClientForm;
