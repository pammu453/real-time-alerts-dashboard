import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, Container, Typography } from '@mui/material';
import AlertTable from './components/AlertTable';
import AlertChart from './components/AlertChart';
import AlertForm from './components/AlertForm';
import { fetchAlerts } from './api';

const socket = io(import.meta.env.VITE_SOCKET_URL);

const App = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [newAlert, setNewAlert] = useState({ type: '', message: '', severity: 'Info' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAlerts = await fetchAlerts(filter, currentPage, pageSize);
      setAlerts(fetchedAlerts);
    };

    fetchData();

    socket.on('updateAlerts', (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => {
      socket.off('updateAlerts');
    };
  }, [currentPage, pageSize, filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Real-Time Alerts Dashboard
      </Typography>

      <Box sx={{  flexDirection: 'row', }}>
        <AlertForm
          newAlert={newAlert}
          setNewAlert={setNewAlert}
          setAlerts={setAlerts}
          socket={socket}
        />

        <AlertChart alerts={alerts} />
      </Box>

      <AlertTable
        alerts={alerts}
        setAlerts={setAlerts}
        filter={filter}
        search={search}
        setFilter={setFilter}
        setSearch={setSearch}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </Container>
  );
};

export default App;
