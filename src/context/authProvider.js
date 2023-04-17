import { useState, useEffect, useContext, createContext } from 'react'
import { useRouter } from 'next/router'
const AuthContext = createContext()
const AuthProvider = ({children}) => {

    const [ auth, setAuth ] = useState(null)

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;
