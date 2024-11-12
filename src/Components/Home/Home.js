import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import '../../App.css'; 
import { Link } from 'react-router-dom';


const Home = ()=>{
    return (
        <div>

<Container maxWidth="sm" className="welcome-container">
          <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom style={{width:"50vw"}}>
              Welcome to the Web Hiring Platform
            </Typography>
            <Typography variant="p" component="h2" gutterBottom 
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 100,
              fontStyle: "normal",
              color: "white",
              marginLeft: "9vw",
              marginTop: "7%",
              width: "30vw",
              lineHeight: "1.5",
              letterSpacing: "0.5px",
              textAlign: "center"
            }}          
            >
              Manage job postings, track candidates, and create assessments
            </Typography>
            <Box className="button-group" style={{ marginLeft: "5%", marginTop: "7%"}}>
              <a href="/jobs">
                <Button variant="contained" color="primary">
                  View Job Postings
                </Button>
              </a>
              <Link href="/candidates" passHref>
                <Button variant="contained" color="primary">
                  Track Candidates
                </Button>
              </Link>
              <a href="/assesments" >
                <Button variant="contained" color="primary">
                  Create Assessments
                </Button>
              </a>
            </Box>
          </Box>
          </Container>

        </div>
    )
}


export default Home;