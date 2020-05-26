import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import Spinner from '../layout/Spinner';
import Profile_Default from '../pages/profile_default.svg';
const Profile = () => {
	const authContext = useContext(AuthContext);
	const { user, isAuthenticated } = authContext;
	const [loading] = useState(false);

	useEffect(() => {
		authContext.loadUser();
		//_getUser(user.id);
		// eslint-disable-next-line
	}, []);
	if (loading) return <Spinner />;
	if (!isAuthenticated || user === null)
		return (
			<div>
				<h1>You must be logged in to view this page.</h1>
			</div>
		);
	return (
		<div className='Profile-Main'>
			<img
				src={
					user.profile_pic !== null && user.profile_pic !== ''
						? user.profile_pic
						: Profile_Default
				}
				alt={user.name}
				style={{ width: '250px' }}
			/>
			<h1>{user.name}</h1>
			<h2>{user.email}</h2>
			{user.website !== null && user.website !== '' && (
				<h3>
					Website: <a href={user.website}>{user.website}</a>
				</h3>
			)}
			{user.bio !== null && user.bio !== '' && <p>{user.bio}</p>}
		</div>
	);
};
export default Profile;
