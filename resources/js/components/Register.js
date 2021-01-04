import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { BrowserRouter, Route, Switch, NavLink, Redirect } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';

import Header from './Header';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class Register extends Component {

  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      c_password: "",
      mobile: "",
      isSuccess: false
    }

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handelAlertMsg = this.handelAlertMsg.bind(this);
    this.clearState = this.clearState.bind(this);

  }

  handleSubmit(e) {
    //e.preventDefault();
    //alert('hiii');
    let API_URL = localStorage.getItem('API_URL');
    let APP_URL = localStorage.getItem('APP_URL');

    let formData = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      mobile: this.state.mobile,
      password: this.state.password,
      c_password: this.state.c_password
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

    axios.post(API_URL + '/register', formData, { headers: headers })
      .then(response => {
        //this.setState({loaded:true})
        if (response.status == 200) {
          this.handelAlertMsg();
        } else {

          localStorage.setItem('ACCESS_TOKEN', "");
        }
      });

  }

  handleFieldChange(e) {
    let stateCopy = Object.assign({}, this.state);
    stateCopy[e.target.name] = e.target.value;
    this.setState(stateCopy);
  }

  handelAlertMsg() {

    let stateCopy = Object.assign({}, this.state);
    stateCopy['isSuccess'] = !this.state.isSuccess;

    this.setState(stateCopy);

  }

  clearState() {

    let stateCopy = Object.assign({}, this.state);
    stateCopy['first_name'] = "";
    stateCopy['last_name'] = "";
    stateCopy['email'] = "";
    stateCopy['password'] = "";
    stateCopy['c_password'] = "";
    stateCopy['mobile'] = "";
    stateCopy['isSuccess'] = false;
    this.setState(stateCopy);
    document.getElementById("register-form").reset();

  }

  render() {
    const { classes } = this.props;
    //console.log('status',this.state);

    const access_token = localStorage.getItem('ACCESS_TOKEN');
    if (access_token != 'null' && typeof access_token != 'undefined' && access_token != 'null') {
      return <Redirect to="/list" />;
    }

    return (
      <div>

        <Header />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
        </Typography>
            <form className={classes.form} id="register-form" noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="first_name"
                    variant="outlined"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    autoFocus
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('first_name', this.state.first_name, 'required', { className: 'text-danger' })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="last_name"
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('last_name', this.state.last_name, 'required', { className: 'text-danger' })}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="mobile"
                    label="Contact Number"
                    name="mobile"
                    autoComplete="mobile"
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('Contact_Number', this.state.mobile, 'required|phone', { className: 'text-danger' })}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('password', this.state.password, 'required|min:8', { className: 'text-danger' })}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="c_password"
                    label="Confirm Password"
                    type="password"
                    id="c_password"
                    autoComplete="current-password"
                    onChange={this.handleFieldChange}
                  />
                  {this.validator.message('confirm_password', this.state.c_password, 'required|min:8', { className: 'text-danger' })}
                </Grid>
                {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
              </Grid>
              <Button
                //type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleSubmit}
              >
                Sign Up
          </Button>
              <Grid container justify="flex-end">
                <Grid item>

                  <NavLink to="/login" >
                    Already have an account? Sign in
                </NavLink>

                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'Copyright © '}
              <Link color="inherit" href="#">
                Your Website
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>

          <Dialog
            open={this.state.isSuccess}
            onClose={this.handelAlertMsg}
            aria-labelledby="confirm-dialog"
          >
            <DialogTitle id="confirm-dialog">Success!</DialogTitle>
            <DialogContent>You are Successfully Registerd</DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => { this.handelAlertMsg(); this.clearState() }}
                color="inherit"
              >
                Ok
        </Button>
              {/* <Button
          variant="contained"
          onClick={() => {
            setOpen();
            onConfirm();
          }}
          color="default"
        >
          Yes
        </Button> */}
            </DialogActions>
          </Dialog>


        </Container>
      </div>
    )
  }
}

export default withStyles(styles)(Register);