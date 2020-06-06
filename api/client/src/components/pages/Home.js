import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import PostContext from '../../contexts/posts/postContext';

const Home = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const postContext = useContext(PostContext);
	const { user } = authContext;
	const [friendsList, setFriendsList] = useState(null);
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (user === null || !authContext.isAuthenticated)
				authContext.loadUser();
			// if (
			// 	user !== null &&
			// 	user.Subscribed_Sections &&
			// 	postContext.feed_posts === null
			// ) {
			// 	postContext.getFeedPosts(user.Subscribed_Sections);
			// }
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

	const getFeed = () => {
		if (user === null) return null;

		if (user.Subscribed_Sections) {
			if (postContext.feed_posts === null) {
				postContext.getFeedPosts(user.Subscribed_Sections);
			}
		}
		let returnValue = <li>No posts yet.</li>;
		if (postContext.feed_posts) {
			returnValue = [];
			for (let post in postContext.feed_posts) {
				returnValue.push(
					<li>
						<Link to='/'>
							{postContext.feed_posts[post].title} - Posted By{' '}
							{postContext.feed_posts[post].creator} in{' '}
							{postContext.feed_posts[post].section_id}
						</Link>
					</li>
				);
			}
		}
		return returnValue;
	};

	return (
		<div className='Home-Page'>
			<div className='Feed'>
				<h2>Feed</h2>
				<ul>{getFeed()}</ul>
			</div>
			<div className='Friends'>
				<h2>Friends</h2>
				{getFriends()}
			</div>
		</div>
	);
};
export default Home;
