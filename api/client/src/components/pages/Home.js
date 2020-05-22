import React, { useContext, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
const Home = () => {
	const authContext = useContext(AuthContext);
	useEffect(() => {
		authContext.loadUser();
		// eslint-disable-next-line
	}, []);
	return (
		<div className='grid-2'>
			<div>Hello</div>
			<div>World!</div>
		</div>
	);
};
export default Home;
