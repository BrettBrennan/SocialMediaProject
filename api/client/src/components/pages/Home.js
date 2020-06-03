import React, { useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';

import SectionsList from '../sections/SectionList';
const Home = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (authContext.user === null || !authContext.isAuthenticated)
				authContext.loadUser();
		}

		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	return (
		<div className='grid-2'>
			<div>
				<h2>Feed</h2>
				<h3>Your Subscribed Sections</h3>
				<SectionsList ownedByUser={false} subscribeFilter={true} />
			</div>
			<div>
				<h2>Friends</h2>
			</div>
		</div>
	);
};
export default Home;
