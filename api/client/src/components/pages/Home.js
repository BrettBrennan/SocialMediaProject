import React, { useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
const Home = () => {
	const authContext = useContext(AuthContext);
	useEffect(() => {
		let mounted = true;
		if (mounted) authContext.loadUser();

		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	return (
		<div className='grid-2'>
			<div>
				<h2>Feed</h2>
			</div>
			<div>
				<h2>Friends</h2>
			</div>
		</div>
	);
};
export default Home;
