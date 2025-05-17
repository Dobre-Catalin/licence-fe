import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 }
];

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        const teacherId = localStorage.getItem('username');
        authAxios.get(`http://localhost:8080/api/users/studentsByTeacher/${teacherId}`)
            .then(response => {
                setStudents(response.data || []);
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                setStudents([]);
            });
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) return;

        authAxios.get(`http://localhost:8080/api/users/STUDENT/${searchTerm}`)
            .then(response => {
                setSearchResults(response.data || []);
            })
            .catch(error => {
                console.error("Error searching students:", error);
                setSearchResults([]);
            });
    };

    const handleAddClick = (student) => {
        const teacherId = localStorage.getItem('username');
        const studentId = student.username;
        authAxios.post(`http://localhost:8080/api/users/addStudent/${studentId}/to/${teacherId}`)
            .then(response => {
                if (response.status === 200) {
                    alert('Student added successfully');
                    fetchStudents(); // Refresh the student list
                }
            })
            .catch(error => {
                console.error("Error adding student:", error);
                alert('Failed to add student');
            });
    };

    const renderTable = (data, showActions = false, allowDetails = false) => (
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="student table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            {showActions && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
                            <TableRow hover key={index}>
                                {columns.map(column => (
                                    <TableCell key={column.id}>
                                        {student[column.id] || '—'}
                                    </TableCell>
                                ))}
                                {showActions && (
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleAddClick(student)}
                                            sx={{ mr: allowDetails ? 1 : 0 }}
                                        >
                                            Add
                                        </Button>
                                        {allowDetails && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => navigate(`/student/${student.id}`)}
                                            >
                                                Details
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                }}
            />
        </Paper>
    );

    return (
        <div>
            <h1>Student List</h1>
            {renderTable(students, true, true)}

            <div style={{ marginTop: 32 }}>
                <h2>Search Students by Username</h2>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ marginRight: 16 }}
                />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
            </div>

            {searchResults.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <h2>Search Results</h2>
                    {renderTable(searchResults, true, false)}
                </div>
            )}
        </div>
    );
}
