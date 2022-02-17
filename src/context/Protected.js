import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export const useProtectedContext = () => {
    return useContext(Context)
}

const ProtectedContext = ({ children }) => {

    const [user, setUser] = useState(null);

    return (
        <Context.Provider value={[user, setUser] }>
            {children}
        </Context.Provider>
    );
};

export default ProtectedContext;

