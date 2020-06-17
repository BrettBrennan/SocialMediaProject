import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
const Friends = () => {
	const authContext = useContext(AuthContext);

	//const { user } = authContext;
	const userContext = useContext(UserContext);
	const [friendsList, setFriendsList] = useState([]);

	const [friendsLoaded, setFriendsLoaded] = useState(false);

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			authContext.loadUser().then((user) => {
				if (!friendsLoaded) loadFriends(user);
			});
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);

	const loadFriends = async (user) => {
		if (user === null) {
			console.error("User was null, couldn't load friends.");
			return null;
		}
		if (friendsList && friendsList.length > 0) return null;
		if (user !== null && user.friends !== null) {
			for (let friend in user.friends) {
				let name = await userContext.getUserName(friend);

				setFriendsList((friendsList) => [
					...friendsList,
					{
						name: name,
						id: friend,
					},
				]);
			}
			setFriendsLoaded(true);
		}
	};
	const getFriends = () => {
		if (friendsList === null) return <h3>You have no friends :(</h3>;
		if (friendsList === null || friendsList.length === 0)
			return <h3>You have no friends :(</h3>;

		if (friendsList) {
			return friendsList.map((friend) => (
				<li key={friend.id}>
					<Link to={'/user/' + friend.id}>{friend.name}</Link>
				</li>
			));
		}
		return null;
	};
	return <ul>{getFriends()}</ul>;
};

export default Friends;
