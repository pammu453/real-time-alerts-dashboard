import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, Select, MenuItem,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import { updateAlertReadStatus, deleteAlert } from '../api';

const AlertTable = ({ alerts, setAlerts, filter, search, setFilter, setSearch, handlePageChange, currentPage, pageSize }) => {
    const filteredAlerts = alerts.filter(
        (alert) =>
            (filter ? alert.severity === filter : true) &&
            (search ? alert.message.toLowerCase().includes(search.toLowerCase()) : true)
    );

    const handleMarkAsRead = async (id) => {
        const updatedAlert = await updateAlertReadStatus(id);
        setAlerts((prev) => prev.map((alert) => (alert.id === id ? updatedAlert : alert)));
    };

    const handleDelete = async (id) => {
        const whatToDelete = confirm("Are you sure you want to delete");
        if (whatToDelete) {
            await deleteAlert(id);
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }
    };

    const getRowStyle = (severity) => {
        switch (severity) {
            case 'Critical':
                return { backgroundColor: '#f44336', color: '#fff' };
            case 'Warning':
                return { backgroundColor: '#ffc107', color: '#000' };
            case 'Info':
                return { backgroundColor: '#2196f3', color: '#fff' };
            default:
                return {};
        }
    };

    return (
        <>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <TextField
                    label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginRight: '1rem' }}
                />
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    displayEmpty
                    style={{ marginRight: '1rem' }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Info">Info</MenuItem>
                    <MenuItem value="Warning">Warning</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                </Select>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAlerts.map((alert) => (
                            <TableRow key={alert.id} style={getRowStyle(alert.severity)}>
                                <TableCell>{alert.id}</TableCell>
                                <TableCell>{alert.type}</TableCell>
                                <TableCell>{alert.message}</TableCell>
                                <TableCell>{alert.severity}</TableCell>
                                <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                                <TableCell>
                                    {alert.is_read ? (
                                        <span style={{ color: 'green', fontWeight: 'bold' }}>Read</span>
                                    ) : (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Unread</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleMarkAsRead(alert.id)}>
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(alert.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </Button>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={filteredAlerts.length < pageSize}
                >
                    Next
                </Button>
            </div>
        </>
    );
};

export default AlertTable;
