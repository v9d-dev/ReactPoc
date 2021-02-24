import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { NavLink, Redirect } from "react-router-dom";




export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false
        }
    }

    logout = (e) => {
        e.preventDefault();
        let token = localStorage.getItem('ACCESS_TOKEN');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        let API_URL = localStorage.getItem('API_URL');
        axios.get(API_URL + '/logout', { headers: headers })
            .then(response => {
                if (response.status == 200) {
                    localStorage.setItem('ACCESS_TOKEN', null);
                    localStorage.setItem('LOGIN_USER', null);
                    let stateCopy = Object.assign({}, this.state);
                    stateCopy['isRedirect'] = true;
                    this.setState(stateCopy);
                }
            });
    }

    render() {

        const access_token = localStorage.getItem('ACCESS_TOKEN');
        let login_user = localStorage.getItem('LOGIN_USER');

        if (this.state.isRedirect) {
            return <Redirect to="/login" />;
        }

        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                        </IconButton>
                        <Typography variant="h6" style={{ flex: 1 }}>
                            {((access_token != 'null' || typeof access_token != 'undefined') && login_user != 'null') ? 'Welcome '+login_user : 'POC'}
                        </Typography>
                        {(access_token != 'null' && typeof access_token != 'undefined' && access_token != 'null') &&
                            <Grid>
                                <Button color="inherit" onClick={this.logout}>
                                    Logout
                                </Button>
                            </Grid>
                        }

                        {(access_token == 'false' || access_token == 'undefined' || access_token == 'null' || access_token == "") &&
                            <>
                                <Grid>
                                    <NavLink to="/login" >
                                        <Button color="inherit">
                                            LogIn
                                        </Button>
                                    </NavLink>
                                </Grid>
                                <Grid>
                                    <NavLink to="/register" >
                                        <Button color="inherit">
                                            Register
                                        </Button>
                                    </NavLink>
                                </Grid>
                            </>
                        }
                    </Toolbar>
                </AppBar>
            </>
        )
    }
}
