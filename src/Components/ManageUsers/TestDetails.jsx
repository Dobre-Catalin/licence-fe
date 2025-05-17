import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card, CardContent, Typography, Chip, Box, CircularProgress
} from '@mui/material';
import axios from 'axios';

export default function TestDetails() {
    const { id } = useParams();
    const [testDetails, setTestDetails] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [loading, setLoading] = useState(true);

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    useEffect(() => {
        fetchTestDetails();
    }, []);

    const fetchTestDetails = async () => {
        try {
            const response = await authAxios.get(`http://localhost:8080/api/test/testDetails/${id}`);
            const testData = response.data;
            setTestDetails(testData);
            fetchImages(testData.questions || []);
        } catch (error) {
            console.error("Error fetching test details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchImages = async (questions) => {
        const newImageUrls = {};
        for (let question of questions) {
            try {
                const imageRes = await authAxios.get(
                    `http://localhost:8080/api/question/getQuestionImage/${question.id}`,
                    { responseType: 'blob' }
                );
                const imageUrl = URL.createObjectURL(imageRes.data);
                newImageUrls[question.id] = imageUrl;
            } catch (err) {
                console.error(`Error loading image for question ${question.id}`, err);
                newImageUrls[question.id] = null;
            }
        }
        setImageUrls(newImageUrls);
    };

    const renderAnswers = (question) => {
        const correctAnswers = question.answers || [];
        const possibleAnswers = question.possibleAnswers || [];

        // If answers are stored per questionId in testDetails.answers:
        const userAnswers = (testDetails.answers && testDetails.answers[question.id]) || [];

        return possibleAnswers.map((answer, index) => {
            const isCorrect = correctAnswers.includes(answer);
            const isUserSelected = userAnswers.includes(answer);

            let color = 'default';
            if (isCorrect) color = 'success';
            else if (isUserSelected) color = 'error';

            return (
                <Chip
                    key={index}
                    label={answer}
                    color={color}
                    variant="outlined"
                    style={{ margin: 4 }}
                />
            );
        });
    };

    if (loading) return <CircularProgress />;

    if (!testDetails) return <Typography>No test details found.</Typography>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Test Details (ID: {testDetails.id})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Grade: {testDetails.grade ?? '—'}
            </Typography>

            {testDetails.questions.map((question, index) => (
                <Card key={question.id} sx={{ marginBottom: 4 }}>
                    <CardContent>
                        <Typography variant="h6">Question {index + 1}</Typography>
                        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                            {imageUrls[question.id] ? (
                                <img
                                    src={imageUrls[question.id]}
                                    alt={`Question ${question.id}`}
                                    style={{ maxWidth: '100%', maxHeight: 300 }}
                                />
                            ) : (
                                <Typography color="error">Image not available</Typography>
                            )}
                        </Box>
                        <Typography variant="subtitle1">Answers:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {renderAnswers(question)}
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
