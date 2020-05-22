import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';

import Home from './components/pages/Home';
import About from './components/pages/About';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import AuthState from './contexts/auth/AuthState';
import AlertState from './contexts/alert/AlertState';

import AuthToken from './utils/AuthToken';

import PrivateRoute from './components/routing/PrivateRoute';

import './App.css';
if (localStorage.token) {
	AuthToken(localStorage.token);
}
function App() {
	return (
		<AuthState>
			<AlertState>
				<Router>
					<Fragment>
						<Navbar />
						<div className='container'>
							<Alerts />
							<Switch>
								<PrivateRoute exact path='/' component={Home} />
								<Route exact path='/about' component={About} />
								<Route
									exact
									path='/register'
									component={Register}
								/>
								<Route exact path='/login' component={Login} />
							</Switch>
						</div>
					</Fragment>
				</Router>
			</AlertState>
		</AuthState>
	);
}

export default App;
