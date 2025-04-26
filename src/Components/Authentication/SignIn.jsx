import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {UserContext} from "../../Context/UserContext";
import {useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const defaultTheme = createTheme();

export default function SignIn() {
    const {user, updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    const authAxios = axios.create({
baseURL: 'http://localhost:8080/api/authentication/login',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if (username === 'test' && password === 'test') {
            updateUser({
                username: 'test',
                token: 'fake-jwt-token',
            });
            sessionStorage.setItem('username', 'test');
            sessionStorage.setItem('token', 'fake-jwt-token');
            localStorage.setItem('username', 'test');
            localStorage.setItem('token', 'fake-jwt-token');
            window.alert('Logged in with test/test (no backend)');
            navigate('/home');
            return;
        }

        await authAxios.post('', {
            username,
            password,
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    updateUser({
                        username,
                        token: response.data.token,
                        permissionLevel: response.data.role,
                    });
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('token', response.data.token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('permission', response.data.role);
                    window.alert('Login successful.');
                    navigate('/home');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.alert('Login failed.');
            });
    };


    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#2a3439', // Gunmetal
                                '&:hover': {
                                    backgroundColor: '#1f272b', // Slightly darker on hover
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                        </Grid>
                    </Box>
                </Box>
            </Container>
    );
}