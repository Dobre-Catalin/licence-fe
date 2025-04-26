import React, { useState } from 'react';
import { useTestContext } from '../Container/TestContextWrapper.jsx';
import axios from 'axios';
import {
    Box,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function TakeTest() {
    const authAxios = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })

    const [numQuestions, setNumQuestions] = useState('');
    const [timePerQuestion, setTimePerQuestion] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [fetchedQuestionIds, setFetchedQuestionIds] = useState([]);

    const { setQuestionIds: setContextQuestions, setTimeLimit } = useTestContext();

    const navigate = useNavigate();

    const handleNumQuestionsChange = (e) => {
        setNumQuestions(e.target.value);
    };

    const handleTimePerQuestionChange = (e) => {
        setTimePerQuestion(e.target.value);
    };

    const handleStartTest = async () => {
        try {
            const response = await authAxios.get(`http://localhost:8080/api/test/create/${numQuestions}`, {
                method: 'GET'
            });

            const ids = response.data || []; // Adjust based on your API response

            setFetchedQuestionIds(ids);
            console.log(response.data);

            // Update context
            setContextQuestions(ids);
            console.log("setQuestionIds:", ids);
            console.log("setTimeLimit:", setTimeLimit);
            setTimeLimit(timePerQuestion * ids.length); // Total test time in seconds

            setOpenDialog(true); // Open confirmation dialog
            navigate(`/test`, {});

        } catch (error) {
            console.error('Error starting test:', error);
            alert('Error starting test. Please try again.');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Navigate to another page if needed
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Take the Test
            </Typography>

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        type="number"
                        label="Number of Questions (1-30)"
                        inputProps={{ min: 1, max: 30 }}
                        value={numQuestions}
                        onChange={handleNumQuestionsChange}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Time per Question</InputLabel>
                    <Select
                        value={timePerQuestion}
                        onChange={handleTimePerQuestionChange}
                        label="Time per Question"
                        disabled={!numQuestions}
                    >
                        <MenuItem value={5}>5 seconds</MenuItem>
                        <MenuItem value={10}>10 seconds</MenuItem>
                        <MenuItem value={15}>15 seconds</MenuItem>
                        <MenuItem value={30}>30 seconds</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleStartTest}
                    disabled={!numQuestions || !timePerQuestion}
                >
                    Start Test
                </Button>
            </Box>

            {/* Material UI Dialog for showing Question IDs */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Test Started!</DialogTitle>
                <DialogContent>
                    <Typography>
                        Question IDs: {fetchedQuestionIds.join(', ')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
