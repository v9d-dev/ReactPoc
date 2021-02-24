import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import { NavLink, Redirect } from "react-router-dom";
import Header from './Header';
import SimpleReactValidator from 'simple-react-validator';



const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class Login extends Component {

  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false

    };
  }

  handleSubmit = (e) => {
    let API_URL = localStorage.getItem('API_URL');
    let APP_URL = localStorage.getItem('APP_URL');
    let formData = {
      email: this.state.email,
      password: this.state.password
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (!this.validator.allValid()) {

      this.validator.showMessages();
      this.forceUpdate();
    
      return false;
    }

    try {
      axios.post(API_URL + '/login', formData, { headers: headers })
        .then(response => {
          console.log('login=>', response);
          if (response.status == 200 && response.data.success == true) {

            console.log('response => ', response);
            localStorage.setItem('ACCESS_TOKEN', response.data.data.token);
            localStorage.setItem('LOGIN_USER', response.data.data.userData.first_name + ' ' + response.data.data.userData.last_name);
            let stateCopy = Object.assign({}, this.state);
            stateCopy['isLoggedIn'] = true;
            this.setState(stateCopy);

          } else {

            localStorage.setItem('ACCESS_TOKEN', null);
            localStorage.setItem('LOGIN_USER', null);
            alert('Invalid Username password!!');

          }
        });
    } catch (err) {
      console.error("Error response from login API:");
      console.error(err.response.data);
      console.error(err.response.status);
    }

  }

  handleFieldChange = (e) => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy[e.target.name] = e.target.value;
    this.setState(stateCopy);
  }
  
  render() {

    if (this.state.isLoggedIn) {
      return <Redirect to="/list" />;
    }
    const access_token = localStorage.getItem('ACCESS_TOKEN');
    if (access_token != 'null' && typeof access_token != 'undefined' && access_token != 'null') {
      return <Redirect to="/list" />;
    }

    return (
      <>
      <Header />
        <Container component="main" maxWidth="xs">
        <CssBaseline />
          <div className={this.props.classes.paper}>
            <Avatar className={this.props.classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={this.props.classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleFieldChange}
              />
              {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleFieldChange}
              />
              {this.validator.message('password', this.state.password, 'required', { className: 'text-danger' })}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={this.props.classes.submit}
                onClick={this.handleSubmit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid container justify="flex-end">
                  <Grid item>
                    <NavLink to="/register" >
                      {"Don't have an account? Sign Up"}
                    </NavLink>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'Copyright © '}
              <Link color="inherit" href="#">
                Your Website
              </Link>
              {' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Container>
      </>
    )
  }
}

export default withStyles(styles)(Login);