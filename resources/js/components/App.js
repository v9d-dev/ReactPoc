import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom'


import AuthLayout from './layouts/UserLayout';
import Login from './Login';
//import Login from './Signin2';
import Register from './Register';
import List from './List';
import Home from './Home';

class App extends Component {

	constructor(props) {
		super(props);

	}
	


	render() {

let API_URL,APP_URL;
//alert(window.location.hostname);
APP_URL = "http://localhost:8000";
API_URL= APP_URL+"/api"; 


localStorage.setItem('API_URL', API_URL);
localStorage.setItem('APP_URL', APP_URL);

//localStorage.setItem('ACCESS_TOKEN', "");
  
console.log('app_url => ',API_URL);
		return (
			<BrowserRouter>
					{/* <div className=''> */}
					<Switch>
					   {/* <Route path="/login" render={(props) => <Login  {...props} />} /> */}
					   <Route exact path="/" component={Login}></Route>
					    <Route path="/login" component={Login}></Route>
						<Route path="/register" component={Register}></Route>
						<Route path="/list" render={(props) => <List />} />
					
					</Switch>
					{/* </div> */}
			</BrowserRouter>
			
		)

	}
}

ReactDOM.render(<App />, document.getElementById('app'))
