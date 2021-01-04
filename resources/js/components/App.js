import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'


import Login from './Login';
import Register from './Register';
import List from './List';

class App extends Component {

	constructor(props) {
		super(props);

	}

	render() {

		let API_URL, APP_URL;
		APP_URL = "http://localhost:8000";
		API_URL = APP_URL + "/api";

		localStorage.setItem('API_URL', API_URL);
		localStorage.setItem('APP_URL', APP_URL);
		
		return (
			<BrowserRouter>
			
				<Switch>
					
					<Route exact path="/" component={Login}></Route>
					<Route path="/login" component={Login}></Route>
					<Route path="/register" component={Register}></Route>
					<Route path="/list" render={(props) => <List />} />

				</Switch>
				
			</BrowserRouter>

		)

	}
}

ReactDOM.render(<App />, document.getElementById('app'))
