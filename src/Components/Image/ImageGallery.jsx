import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';

import segmentation from "../../assets/Segmentation.png"
import Box from "@mui/material/Box";

const PLACEHOLDER_IMAGE = segmentation;

export default function StandardImageList() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/images');
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setImages(data);
                } else {
                    // No images returned, show placeholders
                    const placeholders = Array.from({ length: 15 }).map((_, i) => ({
                        img: PLACEHOLDER_IMAGE,
                        title: `Placeholder ${i + 1}`,
                    }));
                    setImages(placeholders);
                }
            } catch (error) {
                console.error('Fetch failed, using placeholders');
                const placeholders = Array.from({ length: 15 }).map((_, i) => ({
                    img: PLACEHOLDER_IMAGE,
                    title: `Placeholder ${i + 1}`,
                }));
                setImages(placeholders);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ImageList sx={{ width: 'auto', height: 'auto' }} cols={3} rowHeight={164}>
                {images.map((item, index) => (
                    <ImageListItem key={`${item.img}-${index}`}>
                        <img
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}
