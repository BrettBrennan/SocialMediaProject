import React from 'react';
import Feed from '../layout/Feed';
import Friends from '../layout/Friends';
const Home = () => {
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
