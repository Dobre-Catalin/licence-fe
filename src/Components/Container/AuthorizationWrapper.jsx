import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserProvider} from "../Container/UserContext.jsx";

const AuthorizationWrapper = ({children, allowedPermissionLevels}) => {
    const navigate = useNavigate();
    const [text, setText] = useState(undefined);
    const {user} = useContext(UserProvider);

    const permissionsCheck = () => {
        if (allowedPermissionLevels.length === 0 && user.permission !== '') {
            setText('We could not find this page for you! Redirecting to your account...');
            setTimeout(() => {
                navigate('/home');
            }, 4000);
        } else if (!allowedPermissionLevels.includes(user.permission)) {
            setText('You are not authorized to view this page! Use an account that has authorization to view this page! Redirecting to your account...');
            setTimeout(() => {
                navigate('/home');
            }, 4000);
        } else {
            setText(undefined);
        }
    }

    useEffect(permissionsCheck, [user, allowedPermissionLevels]);

    return (
        <>
            {text ? <h1>{text}</h1> : children}
        </>
    );
}

export default AuthorizationWrapper;