const UpdateClientForm = ({
    updateClient,
    updatedClientData,
    setUpdatedClientData,
}) => {
    return (
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
    );
};

export default UpdateClientForm;
