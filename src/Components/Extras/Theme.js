// theme.js
import { createTheme } from '@mui/material/styles';
import segmentationBackground from "../../assets/Segmentation.png"

const theme = createTheme({
    palette: {
        primary: {
            main: '#2a3439',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#607d8b'
        },
        background: {
            default: '#f4f4f4'
        }
    },
});

export default theme;
