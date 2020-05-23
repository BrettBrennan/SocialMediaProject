import React, { useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import Sections from '../sections/Sections';
const Home = () => {
	const authContext = useContext(AuthContext);
	useEffect(() => {
		authContext.loadUser();
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
