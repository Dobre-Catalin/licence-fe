import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Checkbox, FormControlLabel } from '@mui/material';

export default function UploadAndCreateQuestion() {
    const [resultImage, setResultImage] = useState(null);
    const [buttonText, setButtonText] = useState('Upload image and create question');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [answers, setAnswers] = useState([{ text: '', correct: false }, { text: '', correct: false }]); // Start with two answers

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        // Fill possibleAnswers and answers according to the updated model
        const possibleAnswers = new Set(answers.filter(a => a.text.trim() !== '').map(a => a.text.trim()));
        const correctAnswers = new Set(answers.filter(a => a.correct && a.text.trim() !== '').map(a => a.text.trim()));

        const questionDTO = {
            possibleAnswers: Array.from(possibleAnswers),
            answers: Array.from(correctAnswers)
        };

        formData.append('questionDTO', new Blob(
            [JSON.stringify(questionDTO)],
            { type: 'application/json' }
        ));

        setLoading(true);
        setErrorMessage(null);  // Clear previous errors

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                setErrorMessage('Unauthorized: Please log in to upload images.');
                return;
            }

            const res = await fetch('http://localhost:8080/api/question/create', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to create question: ${res.statusText}`);
            }

            const blob = await res.blob();
            const imageUrl = URL.createObjectURL(blob);
            setResultImage(imageUrl);
            setButtonText('Upload another');
        } catch (err) {
            console.error('Upload failed:', err);
            setErrorMessage('Upload failed. Please try again.');
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...answers];
        newAnswers[index][field] = field === 'correct' ? value : value;
        setAnswers(newAnswers);
    };

    const addAnswerField = () => {
        setAnswers([...answers, { text: '', correct: false }]);
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
            {resultImage && (
                <div style={{ marginBottom: '2rem' }}>
                    <img
                        src={resultImage}
                        alt="Returned from createQuestion"
                        style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                    />
                </div>
            )}

            {errorMessage && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Answer Inputs */}
            <div style={{ marginBottom: '1rem' }}>
                {answers.map((answer, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TextField
                            label={`Answer ${index + 1}`}
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={answer.correct}
                                    onChange={(e) => handleAnswerChange(index, 'correct', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Correct"
                            style={{ marginLeft: '1rem' }}
                        />
                    </div>
                ))}
                <Button
                    variant="outlined"
                    onClick={addAnswerField}
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Add Answer
                </Button>
            </div>

            {/* File Upload */}
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: 'none' }}
            />
            <label htmlFor="image-upload">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    disabled={loading}
                    fullWidth
                    style={{ fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
                </Button>
            </label>
        </div>
    );
}
