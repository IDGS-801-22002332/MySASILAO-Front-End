import React, { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig debe usarse dentro de ConfigProvider");
    }
    return context;
};

export const ConfigProvider = ({ children }) => {
    const URL = 'http://localhost:3000';
    // const URL = 'https://mysasilao-back-end-production.up.railway.app';
    
    

    return (
        <ConfigContext.Provider value={{ URL }}>
            {children}
        </ConfigContext.Provider>
    );
};