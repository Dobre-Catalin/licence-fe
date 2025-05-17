import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 }
];

export default function UserApprovalTable() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialog, setDialog] = useState({ open: false, message: '' });

    const navigate = useNavigate();

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        authAxios.get('http://localhost:8080/api/users/getAll')
            .then(response => {
                setUsers(response.data || []);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setUsers([]);
            });
    };

    const handleDetails = (user) => {
        navigate(`/user/${user.id}`);
    };

    const handleApprove = (user) => {
        setDialog({ open: true, message: `Approved ${user.username}` });
    };

    const handleRemove = (user) => {
        setDialog({ open: true, message: `Removed ${user.username}` });
    };

    const closeDialog = () => {
        setDialog({ open: false, message: '' });
    };

    return (
        <div>
            <h1>User Approval Table</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="user table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell>Details</TableCell>
                                <TableCell>Approve</TableCell>
                                <TableCell>Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                <TableRow hover key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {user[column.id] || '—'}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Button size="small" onClick={() => handleDetails(user)}>Details</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" color="success" onClick={() => handleApprove(user)}>Approve</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" color="error" onClick={() => handleRemove(user)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />
            </Paper>

            {/* Dialog Popup */}
            <Dialog open={dialog.open} onClose={closeDialog}>
                <DialogTitle>Action Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialog.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} autoFocus>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
