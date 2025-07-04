import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  onboarded: boolean;
  token: string;
  isAuthenticated: boolean;
}

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  pass: string;
  setPass: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with an initial dummy value (will be overwritten by Provider)
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use the context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Props for the provider component
interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading,
        email,
        setEmail,
        pass,
        setPass,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
