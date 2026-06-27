import React, { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
  return useContext(ResumeContext);
};

export const ResumeProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <ResumeContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </ResumeContext.Provider>
  );
};
