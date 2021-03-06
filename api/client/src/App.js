import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';

import Home from './components/pages/Home';
import About from './components/pages/About';
import Sections from './components/pages/Sections';
import Profile from './components/pages/Profile';
import Post from './components/pages/Post';
import Messages from './components/pages/Messages';
import User from './components/users/User';
//
import Section from './components/sections/Section';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import AuthState from './contexts/auth/AuthState';
import AlertState from './contexts/alert/AlertState';
import SectionState from './contexts/sections/SectionState';
import PostState from './contexts/posts/PostState';
import CommentState from './contexts/comments/CommentState';
import UserState from './contexts/users/UserState';

import AuthToken from './utils/AuthToken';

import PrivateRoute from './components/routing/PrivateRoute';

import './App.css';
if (localStorage.token) {
	AuthToken(localStorage.token);
}
function App() {
	return (
		<AuthState>
			<SectionState>
				<PostState>
					<CommentState>
						<UserState>
							<AlertState>
								<Router>
									<Fragment>
										<Navbar />
										<div className='container'>
											<Alerts />
											<Switch>
												<Route
													exact
													path='/'
													component={Home}
												/>
												<Route
													exact
													path='/about'
													component={About}
												/>
												<Route
													path='/sections/s/:secID'
													render={({ match }) => (
														<Section
															match={match}
														/>
													)}
												/>
												<Route
													path='/posts/:id'
													render={({ match }) => (
														<Post match={match} />
													)}
												/>
												<Route
													path='/messages'
													component={Messages}
												/>
												<Route
													path='/sections'
													component={Sections}
												/>
												<Route
													exact
													path='/register'
													component={Register}
												/>
												<Route
													exact
													path='/login'
													component={Login}
												/>
												<Route
													path='/user/:id'
													render={({ match }) => (
														<User match={match} />
													)}
												/>
												<PrivateRoute
													exact
													path='/profile'
													component={Profile}
												/>
											</Switch>
										</div>
									</Fragment>
								</Router>
							</AlertState>
						</UserState>
					</CommentState>
				</PostState>
			</SectionState>
		</AuthState>
	);
}

export default App;
