import React, { Fragment, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, logout, user } = authContext;
	const onLogout = () => {
		logout();
	};

	const authLinks = (
		<Fragment>
			<li>Hello, {user && user.name}</li>
			<li>
				<a href='/'>Home</a>
			</li>
			<li>
				<a href='/sections'>Sections</a>
			</li>
			<li>
				<a href='/'>Profile</a>
			</li>
			<li>
				<a onClick={onLogout} href='#!'>
					<i className='fas fa-sign-out-alt' />{' '}
					<span className='hide-sm'>Logout</span>
				</a>
			</li>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<li>
				<Link to='/register'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
		</Fragment>
	);

	return (
		<div className='navbar bg-primary'>
			<h1>
				<i className={icon} /> {title}
			</h1>
			<ul>{isAuthenticated ? authLinks : guestLinks}</ul>
		</div>
	);
};

Navbar.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
};
Navbar.defaultProps = {
	title: 'Social Media App',
	icon: 'fas fa-users',
};
export default Navbar;
