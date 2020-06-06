import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';

import SectionsList from '../sections/SectionList';
const Home = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const { user } = authContext;
	const [friendsList, setFriendsList] = useState(null);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (user === null || !authContext.isAuthenticated)
				authContext.loadUser();
			if (user !== null && user.friends !== null) {
				for (let friend in user.friends) {
					userContext.getUserName(friend).then((response) => {
						let oldList = friendsList;
						if (oldList === null) oldList = [];
						oldList.push({
							name: response,
							id: friend,
						});
						setFriendsList(oldList);
					});
				}
			}
		}

		return () => (mounted = false);
		// eslint-disable-next-line
	}, [user]);
	const getFriends = () => {
		if (user === null) return <h3>You have no friends :(</h3>;
		if (user.friends === null || JSON.stringify(user.friends) === '{}')
			return <h3>You have no friends :(</h3>;

		if (friendsList) {
			let returnValue = [];
			for (let friend in friendsList) {
				let link = '/user/' + friendsList[friend].id;
				let value = (
					<li key={friend}>
						<Link to={link}>{friendsList[friend].name}</Link>
					</li>
				);
				returnValue.push(value);
			}
			return <ul>{returnValue}</ul>;
		}
	};
	return (
		<div className='grid-2'>
			<div>
				<h2>Feed</h2>
				<h3>Your Subscribed Sections</h3>
				<SectionsList ownedByUser={false} subscribeFilter={true} />
			</div>
			<div>
				<h2>Friends</h2>
				{getFriends()}
			</div>
		</div>
	);
};
export default Home;
