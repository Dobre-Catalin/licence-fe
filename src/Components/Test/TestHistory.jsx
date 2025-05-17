import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'id', label: 'Test ID', minWidth: 100 },
    { id: 'grade', label: 'Grade', minWidth: 100 },
    { id: 'startTime', label: 'Start Time', minWidth: 170 },
];

export default function TestHistory() {
    const [tests, setTests] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    useEffect(() => {
        fetchTestHistory();
    }, []);

    const fetchTestHistory = () => {
        authAxios.get(`http://localhost:8080/api/test/getMyTests`)
            .then(response => {
                setTests(response.data || []);
            })
            .catch(error => {
                console.error("Error fetching test history:", error);
                setTests([]);
            });
    };

    const handleDetailsClick = (testId) => {
        navigate(`/testDetails/${testId}`);
    };

    return (
        <div>
            <h1>Test History</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="test history table">
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test, index) => (
                                <TableRow hover key={index}>
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
                    count={tests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />
            </Paper>
        </div>
    );
}
