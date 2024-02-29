import { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import useAuthState from '../hooks/useAuthState';
import AddClientForm from './AddClientForm';
import UpdateClientForm from './UpdateClientForm';
import ClientsList from './ClientsList';

const ClientForm = ({ clientsList, setClientsList }) => {
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

    const { getClientsList, onAddClient, deleteClient, updateClient } =
        useFirestore({
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
            <AddClientForm
                onAddClient={onAddClient}
                newClientData={newClientData}
                setNewClientData={setNewClientData}
            />
            {showUpdateForm && (
                <UpdateClientForm
                    updateClient={updateClient}
                    updatedClientData={updatedClientData}
                    setUpdatedClientData={setUpdatedClientData}
                />
            )}
            <ClientsList
                clientsList={clientsList}
                deleteClient={deleteClient}
                setUpdateId={setUpdateId}
                setUpdatedClientData={setUpdatedClientData}
                setShowUpdateForm={setShowUpdateForm}
            />
        </div>
    );
};

export default ClientForm;
