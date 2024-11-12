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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

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

function AssessmentManager() {
  const [jobs, setJobs] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [open, setOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    // Load initial state from local storage
    const loadData = () => {
      const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      setJobs(savedJobs);
      setAssessments(savedAssessments);
    };

    loadData();
    // Add event listener to update data if changed in another tab
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  useEffect(() => {
    if(assessments.length!=0)
        localStorage.setItem('assessments', JSON.stringify(assessments));
  }, [assessments]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAssessment(null);
    setFormData({ title: '', questions: [] });
    setCurrentQuestion('');
    setSelectedJob('');
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      questions: assessment.questions,
    });
    setSelectedJob(assessment.jobId);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editingAssessment) {
      setAssessments(assessments.map(assessment =>
        assessment.id === editingAssessment.id
          ? { ...assessment, ...formData, jobId: selectedJob }
          : assessment
      ));
    } else {
      const newAssessment = {
        id: Date.now(),
        jobId: selectedJob,
        title: formData.title,
        questions: formData.questions,
      };
      setAssessments([...assessments, newAssessment]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setAssessments(assessments.filter(assessment => assessment.id !== id));
  };

  const addQuestion = () => {
    if (currentQuestion.trim() !== '') {
      setFormData({
        ...formData,
        questions: [...formData.questions, currentQuestion],
      });
      setCurrentQuestion('');
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
              Assessment Manager
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              disabled={jobs.length === 0}
            >
              Create New Assessment
            </Button>
          </Box>

          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom style={{color:"#1976d2"}}>
                      {assessment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Job: {jobs.find(job => job.id === assessment.jobId)?.title || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Questions: {assessment.questions.length}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" onClick={() => handleEdit(assessment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(assessment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel id="job-select-label">Select Job</InputLabel>
                <Select
                  labelId="job-select-label"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  label="Select Job"
                >
                  {jobs.map((job) => (
                    <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                autoFocus
                margin="dense"
                label="Assessment Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Questions:</Typography>
                <List>
                  {formData.questions.map((question, index) => (
                    <ListItem key={index} secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => removeQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={question} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    label="New Question"
                    variant="outlined"
                    fullWidth
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                  />
                  <Button onClick={addQuestion} startIcon={<AddIcon />} sx={{ ml: 1 }}>Add</Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {editingAssessment ? 'Save Changes' : 'Create Assessment'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AssessmentManager;