import React, { Fragment, useEffect, useState, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const { isAuthenticated, logout, user } = authContext;
	const { updateUser } = userContext;
	const [showNots, setShowNots] = useState(false);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (user === null) authContext.loadUser();
		}
		return () => (mounted = false);
	}, []);
	const onLogout = () => {
		logout();
	};

	const authLinks = (
		<Fragment>
			<li>
				Hello, <Link to='/profile'>{user && user.name}</Link>
			</li>
			<li>
				<a href='/'>Home</a>
			</li>
			<li>
				<a href='/sections'>Sections</a>
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
				<Link to='/'>Home</Link>
			</li>
			<li>
				<Link to='/sections'>Sections</Link>
			</li>
			<li>
				<Link to='/register'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
		</Fragment>
	);
	const acceptRequest = (id) => {
		if (user !== null) {
			let fList = null;
			if (user.friends !== null) fList = user.friends;

			fList = { ...fList, [id]: 1 };

			updateUser(user.id, {
				type: 'friends',
				payload: fList,
			}).then(() => {
				let newRequests = user.friend_requests;
				delete newRequests[id];
				updateUser(user.id, {
					type: 'friend_requests',
					payload: newRequests,
				});
			});
		}
	};
	const declineRequest = (id) => {};
	const getRequests = () => {
		let returnValue = [];
		for (let key in user.friend_requests) {
			let value = (
				<li key={key} className='Notifications-Item'>
					<span className='Notifications-FR-Name'>
						{user.friend_requests[key].Name}
					</span>
					<i
						className='fas fa-check Notifications-Accept'
						onClick={() => acceptRequest(key)}
					/>
					<i
						className='fas fa-ban Notifications-Decline'
						onClick={() => declineRequest(key)}
					/>
				</li>
			);
			returnValue.push(value);
		}
		if (returnValue === []) return <li>No friend requests.</li>;
		return returnValue;
	};
	const getNotifications = () => {
		if (user !== null) {
			if (user.friend_requests !== null) {
				return getRequests();
			}
		}
		return null;
	};
	const getNotificationCount = () => {
		if (user !== null) {
			if (user.friend_requests !== null) {
				let requestCount = Object.keys(user.friend_requests).length;
				if (requestCount > 0) {
					return <span className='Notifications-Count'></span>;
				}
			}
		}
		return null;
	};

	return (
		<div className='navbar bg-primary'>
			<h1>
				<i className={icon} /> {title}
			</h1>
			<ul>
				{isAuthenticated &&
					user !== null &&
					(showNots === true ? (
						<li
							className='Notifications'
							onClick={() => setShowNots(!showNots)}
						>
							<i className='fas fa-inbox' />
							<ul className='Notifications-Tray'>
								{getNotifications()}
							</ul>
						</li>
					) : (
						<li
							className='Notifications'
							onClick={() => setShowNots(!showNots)}
						>
							<i className='fas fa-inbox' />
							{getNotificationCount()}
						</li>
					))}
				{isAuthenticated ? authLinks : guestLinks}
			</ul>
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
