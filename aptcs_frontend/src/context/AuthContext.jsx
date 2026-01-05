import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login/`, {
                username: e.target.username.value,
                password: e.target.password.value
            });
            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Login failed. Please check your credentials.';
            setLoginError(errorMessage);
            console.error("Login Error:", error);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    }, [loading]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
