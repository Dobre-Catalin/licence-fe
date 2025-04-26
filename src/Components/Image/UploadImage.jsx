import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // <<--- import this!

export default function UploadAndShowImage() {
    const [resultImage, setResultImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null); // <<-- NEW STATE
    const [buttonText, setButtonText] = useState('Upload image');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate(); // <<-- hook for navigation

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setOriginalImage(URL.createObjectURL(file)); // <<-- Save original image preview

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        setErrorMessage(null);

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                setErrorMessage('Unauthorized: Please log in to upload images.');
                return;
            }

            const res = await fetch('http://localhost:8080/api/simulateModel', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to upload image: ${res.statusText}`);
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

    const handleCompare = () => {
        navigate('/compare', {
            state: {
                originalImage,
                resultImage,
            },
        });
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
            {resultImage && (
                <div style={{ marginBottom: '2rem' }}>
                    <img
                        src={resultImage}
                        alt="Returned from simulateModel"
                        style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                    />
                </div>
            )}

            {errorMessage && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    <p>{errorMessage}</p>
                </div>
            )}

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
                    style={{ fontWeight: 'bold', marginBottom: '1rem' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
                </Button>
            </label>

            {resultImage && (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCompare}
                    fullWidth
                    style={{ fontWeight: 'bold', marginTop: '1rem' }}
                >
                    Compare
                </Button>
            )}
        </div>
    );
}
