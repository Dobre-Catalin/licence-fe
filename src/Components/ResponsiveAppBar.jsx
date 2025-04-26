import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import { UserContext } from "../Context/UserContext";

// Define the possible pages for each type of user
const loggedOutPages = ['Sign In', 'Register'];
const loggedInStudent = ['Take Test', 'Upload Image', 'Test History', 'Gallery', 'LogOut'];
const loggedInTeacher = ['Take Test', 'Upload Image', 'Test History', 'Gallery', 'Add Question', 'Students', 'LogOut'];
const loggedInAdmin = ['Approve Users', 'Add Question', 'LogOut'];

const ResponsiveAppBar = () => {
    const { user } = useContext(UserContext);

    // State to store the pages based on the user's status
    const [pages, setPages] = useState(loggedOutPages);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('permission');

        if (!token) {
            setPages(loggedOutPages); // No token, show logged out pages
        } else {
            // Determine which pages to show based on role
            switch (role) {
                case 'STUDENT':
                    setPages(loggedInStudent);
                    break;
                case 'TEACHER':
                    setPages(loggedInTeacher);
                    break;
                case 'ADMIN':
                    setPages(loggedInAdmin);
                    break;
                default:
                    setPages(loggedOutPages); // Default fallback
                    break;
            }
        }
    }, [user]); // Re-run whenever `user` context or localStorage changes

    return (
        <AppBar position="static" sx={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ width: '100%', px: 0 }}>
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/home"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            AI-Driver Inc.
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page, index) => (
                                <Button
                                    key={index}
                                    component={Link}
                                    to={`/${page.toLowerCase().replace(/\s+/g, '')}`}
                                    sx={{ color: 'inherit', textDecoration: 'none', textTransform: 'none' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Box>
            </Box>
        </AppBar>
    );
};

export default ResponsiveAppBar;
