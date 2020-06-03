import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';

import Spinner from '../layout/Spinner';
import Profile_Default from '../pages/profile_default.svg';
import NewLineToBr from '../Formatters';
const User = ({ match }) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);
	const userContext = useContext(UserContext);
	const { isAuthenticated } = authContext;
	const { setAlert } = alertContext;
	const { getUser, updateUser } = userContext;
	const [isUserProfile, setIsUserProfile] = useState(false);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (authContext.user === null) {
				authContext.loadUser();
			}
			if (match.params.id !== '') {
				getUser(match.params.id).then(() => {
					if (userContext.error !== null)
						console.error(userContext.error);
				});
				if (authContext.user !== null) {
					setIsUserProfile(authContext.user.id === match.params.id);
				}
			}
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	if (authContext.loading || userContext.loading) return <Spinner />;
	if (!isAuthenticated)
		return (
			<div>
				<h1>You must be logged in to view this page.</h1>
			</div>
		);
	if (userContext.user === null) {
		return (
			<div>
				<h1>Error: Cannot find this user.</h1>
			</div>
		);
	}

	const removeFriend = () => {
		if (authContext.user === null) {
			authContext.loadUser().then(() => {
				removeFriend();
			});
		} else {
			if (authContext.user.friends !== null) {
				if (authContext.user.friends[userContext.user.id] === 1) {
					let fList = authContext.user.friends;
					delete fList[userContext.user.id];
					if (JSON.stringify(fList) === '{}') fList = null;
					updateUser(authContext.user.id, {
						type: 'friends',
						payload: fList,
					}).then(() => {
						userContext.removeFriend(
							userContext.user.id,
							authContext.user.id
						);
						setAlert('Friend Removed!', 'danger');
					});
				}
			}
		}
	};
	const addFriend = () => {
		if (authContext.user === null) {
			authContext.loadUser().then(() => {
				let fList = {
					[authContext.user.id]: {
						Name: authContext.user.name,
						Date: Date.now(),
					},
				};
				if (userContext.user.friend_requests !== null)
					fList = userContext.user.friend_requests;
				fList[authContext.user.id] = {
					Name: authContext.user.name,
					Date: Date.now(),
				};
				fList[authContext.user.id].Name = authContext.user.name;
				updateUser(userContext.user.id, {
					type: 'friend_requests',
					payload: fList,
				}).then(() => {
					setAlert('Friend Request Sent!', 'success');
				});
			});
		} else {
			let fList = {
				[authContext.user.id]: {
					Name: authContext.user.name,
					Date: Date.now(),
				},
			};
			if (userContext.user.friend_requests !== null)
				fList = userContext.user.friend_requests;
			fList[authContext.user.id] = {
				Name: authContext.user.name,
				Date: Date.now(),
			};
			updateUser(userContext.user.id, {
				type: 'friend_requests',
				payload: fList,
			});
		}
	};
	const getFriendButtons = () => {
		let isFriends = false;
		let requestPending = false;
		if (authContext.user !== null && userContext.user !== null) {
			if (authContext.user.friends !== null) {
				if (authContext.user.friends[userContext.user.id] === 1)
					isFriends = true;
			}
		}
		if (!isFriends) {
			if (userContext.user.friend_requests) {
				requestPending =
					userContext.user.friend_requests[authContext.user.id] !==
					null
						? true
						: false;
			}
		}
		if (isFriends) {
			return (
				<Fragment>
					<button
						className='btn btn-remove'
						onClick={() => {
							if (
								window.confirm(
									'Are you sure you want to remove this friend?'
								)
							)
								removeFriend();
						}}
					>
						Remove Friend
					</button>
					<button className='btn btn-blok'>Block</button>
				</Fragment>
			);
		}
		if (requestPending) {
			return (
				<Fragment>
					<button className='btn btn-pending'>Request Sent</button>
					<button className='btn btn-blok'>Block</button>
				</Fragment>
			);
		}
		return (
			<Fragment>
				<button className='btn btn-add' onClick={addFriend}>
					Add Friend
				</button>
				<button className='btn btn-blok'>Block</button>
			</Fragment>
		);
	};
	return (
		<div className='Profile-Main'>
			<div className='Profile-Info'>
				<img
					src={
						userContext.user.profile_pic !== null &&
						userContext.user.profile_pic !== ''
							? userContext.user.profile_pic
							: Profile_Default
					}
					alt={userContext.user.name}
					style={{ width: '250px', borderRadius: '5px' }}
				/>
				<h1>{userContext.user.name}</h1>
				<h4>{userContext.user.email}</h4>
				{userContext.user.website !== null &&
					userContext.user.website !== '' && (
						<h4>
							Website:{' '}
							<a href={userContext.user.website}>
								{userContext.user.website}
							</a>
						</h4>
					)}
				{isUserProfile ? (
					<Link
						to='/profile'
						className='btn btn-block btn-primary text-center'
					>
						Edit Profile <i className='fas fa-edit' />
					</Link>
				) : (
					getFriendButtons()
				)}
			</div>
			{userContext.user.bio !== null && userContext.user.bio !== '' && (
				<p className='Profile-Bio'>
					<NewLineToBr>{userContext.user.bio}</NewLineToBr>
				</p>
			)}
		</div>
	);
};
export default User;
