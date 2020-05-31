import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';
import Spinner from '../layout/Spinner';
import Profile_Default from '../pages/profile_default.svg';
const Profile = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const alertContext = useContext(AlertContext);
	const { user, isAuthenticated } = authContext;
	const { setAlert } = alertContext;
	const { updateUser } = userContext;
	const [loading, setLoading] = useState(false);
	let hasLoaded = false;
	const [userValues, setUserValues] = useState({
		name: '',
		profile_pic: '',
		website: '',
		bio: '',
	});
	const { name, profile_pic, website, bio } = userValues;

	const loadValues = () => {
		if (user === null) return;
		hasLoaded = true;
		setUserValues({
			name: user.name,
			profile_pic: user.profile_pic !== null ? user.profile_pic : '',
			website: user.website !== null ? user.website : '',
			bio: user.bio !== null ? user.bio : '',
		});
	};

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			setLoading(true);
			if (user === null || !isAuthenticated)
				authContext.loadUser().then(() => {
					if (user !== null) {
						loadValues();
					}
					setLoading(false);
				});
		}

		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (user !== null && !hasLoaded) {
			loadValues();
		}
	}, [loading]);
	if (loading || (isAuthenticated && user === null)) return <Spinner />;
	if (!isAuthenticated)
		return (
			<div>
				<h1>You must be logged in to view this page.</h1>
			</div>
		);
	const onChange = (e) => {
		setUserValues({ ...userValues, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();

		if (user !== null) {
			let payload = {
				type: 'profile_pic',
				payload: userValues.profile_pic,
			};

			updateUser(user.id, payload).then(() => {
				payload = {
					type: 'website',
					payload: userValues.website,
				};
				updateUser(user.id, payload).then(() => {
					payload = {
						type: 'bio',
						payload: userValues.bio,
					};
					updateUser(user.id, payload).then((response) => {
						setLoading(false);
						setAlert('Profile Updated!', 'success');
					});
				});
			});
		}
	};
	return (
		<div className='Profile-Main'>
			<form onSubmit={onSubmit}>
				<label htmlFor='profile_pic'>Profile Picture</label>
				<input
					name='profile_pic'
					type='text'
					value={profile_pic || ''}
					onChange={onChange}
				/>
				<label htmlFor='profile_pic'>Your Website</label>
				<input
					name='website'
					type='text'
					value={website || ''}
					onChange={onChange}
				/>
				<label htmlFor='profile_pic'>About You</label>
				<input
					name='bio'
					type='text'
					value={bio || ''}
					onChange={onChange}
				/>
				<button type='submit' className='btn btn-block btn-primary'>
					Update Profile
				</button>
			</form>
		</div>
	);
};
export default Profile;
