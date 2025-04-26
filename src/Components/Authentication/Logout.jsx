import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../Context/UserContext.jsx";

export default function Logout() {
    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogout = () => {
        updateUser({
            username: '',
            token: '',
            permissionLevel: ''
        });
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('permission');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('permission');
        navigate('/signin');
    };

    return (
        <div>
            <h1>Are you sure you want to log out?</h1>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={() => navigate('/home')}>No</button>
        </div>
    );
}