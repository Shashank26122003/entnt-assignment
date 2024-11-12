import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Create a dark theme to match the screenshot
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // The blue color from the buttons
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function JobPostings() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
  });

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if(jobs.length!=0)
        localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      salary: '',
    });
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editingJob) {
      // Update existing job
      setJobs(jobs.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...formData }
          : job
      ));
    } else {
      // Add new job
      const newJob = {
        id: Date.now(),
        ...formData,
        candidates: 0,
      };
      setJobs([...jobs, newJob]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
              Job Postings
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add New Job
            </Button>
          </Box>

          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom style={{color:"#1976d2"}}>
                      {job.title.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {job.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {job.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Salary: {job.salary}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Candidates: {job.candidates}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" onClick={() => handleEdit(job)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(job.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle style={{color:"#1976d2"}}>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Job Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Job Description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Location"
                fullWidth
                variant="outlined"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Salary"
                fullWidth
                variant="outlined"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {editingJob ? 'Save Changes' : 'Add Job'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default JobPostings;