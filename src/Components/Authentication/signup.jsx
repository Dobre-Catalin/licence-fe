import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();
    const [role, setRole] = useState('TEACHER'); // default selection

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const request = {
            username: data.get('username'),
            password: data.get('password'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            role: role // include role in request
        };

        // Decide the endpoint based on role
        const endpoint = role === 'TEACHER'
            ? 'http://localhost:8080/api/authentication/registerInstructor'
            : 'http://localhost:8080/api/authentication/register';

        axios.post(endpoint, request)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    window.alert('Sign up successful.');
                    // navigate to login or home if needed
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.alert('Sign up failed.');
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
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="firstName"
                        label="First Name"
                        type="text"
                        id="firstName"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        type="text"
                        id="lastName"
                    />

                    <FormControl fullWidth required sx={{ mt: 2 }}>
                        <InputLabel id="role-label">Registering as</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            label="Registering as"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="STUDENT">Student</MenuItem>
                            <MenuItem value="TEACHER">Teacher</MenuItem>
                        </Select>
                    </FormControl>

                    {role === 'TEACHER' && (
                        <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                            If you opt out as a teacher, note that it will require separate activation from an admin.
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
