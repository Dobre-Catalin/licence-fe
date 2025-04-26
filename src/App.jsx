import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ResponsiveAppBar from './Components/ResponsiveAppBar.jsx';
import AppOptions from "./Components/ResponsiveAppBar.jsx";
import SignIn from "./Components/Authentication/SignIn";
import SignUp from "./Components/Authentication/signup";
import Home from "./Components/Home";
import Logout from "./Components/Authentication/Logout.jsx";

import theme from "./Components/Extras/Theme.js";

import { UserProvider } from "./Context/UserContext";
import Container from '@mui/material/Container';
import {ThemeProvider} from "@mui/material/styles";
import StudentList from "./Components/ManageUsers/StudentList.jsx";
import ImageGallery from "./Components/Image/ImageGallery.jsx";
import UploadToModel from "./Components/Image/UploadImage.jsx";
import UserApprovalTable from "./Components/ManageUsers/ApproveUsers.jsx";
import AddImageQuestion from "./Components/Image/AddImageQuestion.jsx";
import CreateQuestion from "./Components/Image/AddImageQuestion.jsx";
import CompareImages from "./Components/Image/CompareImages.jsx";
import TakeTest from "./Components/Test/TakeTest.jsx";
import {TestProvider} from "./Components/Container/TestContextWrapper.jsx";
import Test from "./Components/Test/Test.jsx";

const App = () => {
    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <ResponsiveAppBar />
                        <Container sx={{ mt: 2 }}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/signin" replace />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/register" element={<SignUp />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/students" element={<StudentList />} />
                                <Route path="/gallery" element={<ImageGallery />} />
                                <Route path="/uploadimage" element={<UploadToModel />} />
                                <Route path="/approveusers" element={<UserApprovalTable />} />
                                <Route path="/addquestion" element={<CreateQuestion />} />
                                <Route path="/compare" element={<CompareImages />} />
                                <Route path="/taketest" element={
                                    <TestProvider>
                                        <TakeTest />
                                    </TestProvider>
                                } />
                                <Route path="/test" element={
                                    <TestProvider>
                                        <Test />
                                    </TestProvider>
                                } />
                            </Routes>
                        </Container>
                    </BrowserRouter>
            </ThemeProvider>
        </UserProvider>
    );
};

export default App;
