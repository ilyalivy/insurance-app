const AddClientForm = ({ onAddClient, newClientData, setNewClientData }) => {
    return (
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
    );
};

export default AddClientForm;
