import { TextField, Button, Select, MenuItem } from '@mui/material';
import { createAlert } from '../api';
const AlertForm = ({ newAlert, setNewAlert, socket }) => {
    const handleCreateAlert = async () => {
        const alert = await createAlert(newAlert);
        setNewAlert({ type: '', message: '', severity: 'Info' });
        socket.emit('newAlert', alert);
    };

    return (
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <TextField
                label="Type"
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                style={{ marginRight: '1rem' }}
            />
            <TextField
                label="Message"
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                style={{ marginRight: '1rem' }}
            />
            <Select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                displayEmpty
                style={{ marginRight: '1rem' }}
            >
                <MenuItem value="Info">Info</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleCreateAlert}>
                Add Alert
            </Button>
        </div>
    );
};

export default AlertForm;
