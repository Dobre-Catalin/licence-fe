import React, { useState, useEffect } from 'react';
import { useTestContext } from '../Container/TestContextWrapper.jsx';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardMedia
} from '@mui/material';

export default function Test() {
    const authAxios = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
    const { questionIds, currentIndex, nextQuestion, previousQuestion, answers, addAnswer } = useTestContext();
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [possibleAnswers, setPossibleAnswers] = useState([]);

    const currentQuestionId = questionIds[currentIndex];

    useEffect(() => {
        const fetchQuestionImage = async () => {
            console.log('fetch question image:' + currentQuestionId);
            if (!currentQuestionId) return;

            try {
                setLoading(true);
                const response = await authAxios.get(`http://localhost:8080/api/question/get/${currentQuestionId}`);
                setPossibleAnswers(response.data.possibleAnswers);
                console.log("possibleAnswers:", response.data.possibleAnswers);

                const questionImageResponse = await authAxios.get(`http://localhost:8080/api/question/getQuestionImage/${currentQuestionId}`, {
                    responseType: 'blob'
                });

                const imageUrl = URL.createObjectURL(questionImageResponse.data);
                setCurrentImage(imageUrl);

            } catch (error) {
                console.error('Error fetching question image:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionImage();
    }, [currentQuestionId]);


    const handleAnswerClick = (answer) => {
        const currentQuestionId = questionIds[currentIndex];

        if (!answers[currentQuestionId]?.includes(answer)) {
            addAnswer(currentQuestionId, answer);
        }
    };


    const handleNext = () => {
        nextQuestion();
    };

    const handlePrevious = () => {
        previousQuestion();
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Test in Progress
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                Question {currentIndex + 1} / {questionIds.length}
            </Typography>

            <Box sx={{ my: 3 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
                        {currentImage && (
                            <CardMedia
                                component="img"
                                image={currentImage}
                                alt={`Question ${currentQuestionId}`}
                            />
                        )}
                    </Card>
                )}
            </Box>

            {/* Answer Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ my: 2 }}>
                {(possibleAnswers || []).map((answer, index) => (
                    <Grid item key={index}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAnswerClick(answer)}
                        >
                            {answer}
                        </Button>
                    </Grid>
                ))}
            </Grid>


            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={currentIndex === questionIds.length - 1}
                >
                    Next
                </Button>
            </Box>

            {/* Material UI Popup */}
            <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>Answer Selected</DialogTitle>
                <DialogContent>
                    <Typography>{popupMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
