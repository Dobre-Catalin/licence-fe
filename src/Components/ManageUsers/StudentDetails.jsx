import React, { useEffect, useState } from 'react';
import {
    Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [testHistory, setTestHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    useEffect(() => {
        fetchStudentDetails();
        fetchTestHistory();
    }, [id]);

    const fetchStudentDetails = () => {
        authAxios.get(`http://localhost:8080/api/users/get/${id}`)
            .then(res => setStudent(res.data))
            .catch(err => {
                console.error("Error fetching student details:", err);
                setStudent(null);
            });
    };

    const fetchTestHistory = () => {
        authAxios.get(`http://localhost:8080/api/test/getUserTests/${id}`)
            .then(res => setTestHistory(res.data || []))
            .catch(err => {
                console.error("Error fetching test history:", err);
                setTestHistory([]);
            });
    };

    const handleDetailsClick = (testId) => {
        navigate(`/testDetails/${testId}`);
    };

    if (!student) return <Typography>Loading...</Typography>;

    return (
        <div style={{ padding: 24 }}>

            <Paper style={{ padding: 24, marginBottom: 32 }}>
                <Typography variant="h4" gutterBottom>Student Details</Typography>
                <Typography><strong>ID:</strong> {student.id}</Typography>
                <Typography><strong>Username:</strong> {student.username}</Typography>
                <Typography><strong>First Name:</strong> {student.firstname}</Typography>
                <Typography><strong>Last Name:</strong> {student.lastname}</Typography>
                <Typography><strong>Email:</strong> {student.email || 'N/A'}</Typography>
                <Typography><strong>Role:</strong> {student.role}</Typography>
                <Typography><strong>Active:</strong> {student.active ? 'Yes' : 'No'}</Typography>
                <Typography><strong>Enabled:</strong> {student.enabled ? 'Yes' : 'No'}</Typography>
            </Paper>

            <Typography variant="h5" gutterBottom>Test History</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="test history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Test ID</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test) => (
                                <TableRow hover key={test.id}>
                                    <TableCell>{test.id}</TableCell>
                                    <TableCell>{test.grade ?? '—'}</TableCell>
                                    <TableCell>{test.startTime ? new Date(test.startTime).toLocaleString() : '—'}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" onClick={() => handleDetailsClick(test.id)}>
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={testHistory.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />

            </Paper>
            <Button variant="outlined" onClick={() => navigate("/students")} style={{ marginBottom: 16 }}>
                ← Back
            </Button>
        </div>

    );
}
