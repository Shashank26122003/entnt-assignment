import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function CandidateList() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [newCandidate, setNewCandidate] = useState({ name: '', applicationDate: '', resumeUrl: '', status: 'Under Review' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      // Load candidates and jobs from localStorage
      const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      
      console.log("Loaded Candidates:", savedCandidates); // Debugging
      console.log("Loaded Jobs:", savedJobs); // Debugging
      
      // Filter candidates for the current job
      const filteredCandidates = savedCandidates.filter(candidate => candidate.jobId === parseInt(jobId));
      setCandidates(filteredCandidates);

      // Find the specific job
      const selectedJob = savedJobs.find(job => job.id === parseInt(jobId));
      setJob(selectedJob);

      console.log("Filtered Candidates:", filteredCandidates); // Debugging
      console.log("Selected Job:", selectedJob); // Debugging
    };

    loadData();
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [jobId]);

  const handleStatusChange = (candidateId, newStatus) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
    );
    setCandidates(updatedCandidates);
    
    const allCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const updatedAllCandidates = allCandidates.map(candidate =>
      candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
    );
    localStorage.setItem('candidates', JSON.stringify(updatedAllCandidates));
  };

  const handleAddCandidate = () => {
    const newCandidateData = { ...newCandidate, id: Date.now(), jobId: parseInt(jobId) };
    const updatedCandidates = [...candidates, newCandidateData];
    setCandidates(updatedCandidates);

    const allCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    allCandidates.push(newCandidateData);
    localStorage.setItem('candidates', JSON.stringify(allCandidates));

    setNewCandidate({ name: '', applicationDate: '', resumeUrl: '', status: 'Under Review' });
    setIsDialogOpen(false);
  };

  const handleDeleteCandidate = (candidateId) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== candidateId);
    setCandidates(updatedCandidates);

    const allCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const updatedAllCandidates = allCandidates.filter(candidate => candidate.id !== candidateId);
    localStorage.setItem('candidates', JSON.stringify(updatedAllCandidates));
  };

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Candidates for {job ? job.title : 'Loading...'}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ mb: 2 }}>
            Add Candidate
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Link to={`/candidates/${candidate.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {candidate.name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(candidate.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </Button>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel id={`status-label-${candidate.id}`}>Status</InputLabel>
                        <Select
                          labelId={`status-label-${candidate.id}`}
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        >
                          <MenuItem value="Under Review">Under Review</MenuItem>
                          <MenuItem value="Interview Scheduled">Interview Scheduled</MenuItem>
                          <MenuItem value="Offer Extended">Offer Extended</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Link to={`/candidates/${candidate.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fill in the details of the new candidate.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                name="name"
                value={newCandidate.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Application Date"
                type="date"
                fullWidth
                name="applicationDate"
                value={newCandidate.applicationDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                label="Resume URL"
                type="text"
                fullWidth
                name="resumeUrl"
                value={newCandidate.resumeUrl}
                onChange={handleInputChange}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newCandidate.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Interview Scheduled">Interview Scheduled</MenuItem>
                  <MenuItem value="Offer Extended">Offer Extended</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
              <Button onClick={handleAddCandidate} color="primary">Add</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default CandidateList;
