import React, { useContext, useEffect } from 'react';
// import AuthContext from '../../contexts/auth/authContext';
import Feed from '../layout/Feed';
import Friends from '../layout/Friends';
const Home = () => {
	// const authContext = useContext(AuthContext);

	// useEffect(() => {
	// 	let mounted = true;
	// 	if (mounted) {
	// 		authContext.loadUser();
	// 	}
	// 	return () => (mounted = false);
	// 	// eslint-disable-next-line
	// }, []);

	return (
		<div className='Home-Page'>
			<div className='Feed'>
				<h2>Feed</h2>
				<p>
					Recent posts from your subscribed sections will appear here.
				</p>
				<Feed />
			</div>
			<div className='Friends'>
				<h2>Friends</h2>
				<Friends />
			</div>
		</div>
	);
};
export default Home;
