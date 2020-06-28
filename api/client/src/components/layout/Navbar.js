import React, { Fragment, useEffect, useState, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const { isAuthenticated, logout, user } = authContext;
	const { updateUser, getUnreadMessages } = userContext;
	const [showNots, setShowNots] = useState(false);
	const [messages, setMessages] = useState(null);
	const [showMenu, setShowMenu] = useState(true);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			window.addEventListener('resize', (e) => {
				if (window.innerWidth <= 360) setShowMenu(false);
				if (window.innerWidth > 360) setShowMenu(true);
			});
			if (window.innerWidth <= 360) setShowMenu(false);
			if (window.innerWidth > 360) setShowMenu(true);
			if (isAuthenticated && user) getMessages(user.id);
			if (!isAuthenticated || !user)
				authContext.loadUser().then((res_user) => {
					if (res_user) getMessages(res_user.id);
				});
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	const getMessages = (id) => {
		if (!id) return null;
		getUnreadMessages(id).then(async (res) => {
			for (let message in res) {
				let name = await userContext.getUserName(res[message].sender);
				const newMessage = {
					id: res[message].id,
					name: name,
					message: res[message].message,
				};
				if (messages) {
					setMessages((messages) => [...messages, newMessage]);
				} else {
					setMessages({
						0: newMessage,
					});
				}
			}
		});
	};
	const onLogout = () => {
		logout();
		window.location.href = '/login';
	};

	const authLinks = (
		<Fragment>
			<li>
				<Link to='/'>Home</Link>
			</li>
			<li>
				<Link to='/profile'>Profile</Link>
			</li>
			<li>
				<Link to='/messages'>Messages</Link>
			</li>
			<li>
				<Link to='/sections'>Sections</Link>
			</li>
			<li>
				<a onClick={onLogout} href='#!'>
					<i className='fas fa-sign-out-alt' /> <span>Logout</span>
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
				if (JSON.stringify(newRequests) === '{}') newRequests = null;
				updateUser(user.id, {
					type: 'friend_requests',
					payload: newRequests,
				});
				userContext.acceptFriendRequest(id, user.id);
			});
		}
	};
	const declineRequest = (id) => {
		if (user !== null) {
			let fList = user.friend_requests;
			delete fList[id];
			if (JSON.stringify(fList) === '{}') fList = null;
			updateUser(user.id, {
				type: 'friend_requests',
				payload: fList,
			});
		}
	};
	const getRequests = () => {
		let returnValue = [];
		if (messages !== null) {
			for (let key in messages) {
				let value = (
					<li key={key} className='Notifications-Item'>
						<Link to='/messages/'>
							{messages[key].name} sent you a message!
						</Link>
					</li>
				);
				returnValue.push(value);
			}
		}
		if (user.friend_requests !== null)
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
		if (returnValue.length === 0 || returnValue === null)
			return <li>No Notifications.</li>;
		return returnValue;
	};
	const getNotifications = () => {
		if (user !== null) {
			return getRequests();
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
	const getHeaderLinks = () => {
		if (!showMenu) return null;
		return (
			<ul>
				{isAuthenticated &&
					user !== null &&
					(showNots === true ? (
						<li
							className='Notifications font-white'
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
		);
	};
	return (
		<div className='navbar bg-primary'>
			<h1>
				<i className={icon} /> {title}
				<i
					className='fas fa-bars navbar-hamburger'
					onClick={() => setShowMenu(!showMenu)}
				/>
			</h1>
			{getHeaderLinks()}
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
