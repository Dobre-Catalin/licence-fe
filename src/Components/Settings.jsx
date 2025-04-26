import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Settings = () => {
    const [numberOfEntities, setNumberOfEntities] = useState(0);
    const [interval, setInterval] = useState(0);
    const navigate = useNavigate();

    //fetch the current settings
    axios.get('http://188.27.132.161:8080/api/cars/settings').then(response => {
        console.log(response);
        setNumberOfEntities(response.data.entitiesToAdd);
        setInterval(response.data.interval);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send data to backend /api/cars/settings
        try {
            const response = await axios.get('http://188.27.132.161:8080/api/cars/settings', {
                entitiesToAdd: numberOfEntities,
                interval: interval
            });
            console.log('Settings submitted:', response.data);
            window.alert('Settings submitted successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error submitting settings:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Settings
            </Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Number of Entities"
                            value={numberOfEntities}
                            onChange={(e) => setNumberOfEntities(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Interval (in milliseconds)"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            required
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '1rem' }}
                >
                    Save Settings
                </Button>
                <Typography component="h1" variant="h5">
                    Current settings are {numberOfEntities} entities every {interval} milliseconds.
                </Typography>
            </form>
        </Container>
    );
};

export default Settings;
