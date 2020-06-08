import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import PostContext from '../../contexts/posts/postContext';
import SectionContext from '../../contexts/sections/sectionContext';
import Spinner from '../layout/Spinner';
const Feed = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const postContext = useContext(PostContext);
	const sectionContext = useContext(SectionContext);

	const [feedList, setFeedList] = useState([]);
	const [feedLoaded, setFeedLoaded] = useState(false);
	const loadFeed = (user) => {
		if (user === null) {
			console.error("User was null, couldn't load feed.");
			return null;
		}
		if (feedList && feedList.length > 0) return null;
		if (user.Subscribed_Sections) {
			postContext
				.getFeedPosts(user.Subscribed_Sections)
				.then((response) => {
					fillFeed(response);
				});
		}
	};

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			authContext.loadUser().then((user) => {
				if (!feedLoaded) loadFeed(user);
			});
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	function fillFeed(response) {
		if (!postContext || !userContext) return null;

		if (response) {
			const feed =
				postContext.feed_posts !== null
					? postContext.feed_posts
					: response;
			feed.map((post) => {
				userContext.getUserName(post.creator).then((response2) => {
					sectionContext
						.getSectionName(post.section_id)
						.then((response3) => {
							setFeedList((feedList) => [
								...feedList,
								{
									creator: response2,
									section_name: response3,
									title: post.title,
								},
							]);
						});
				});
			});
			setFeedLoaded(true);
		}
	}
	function getFeed() {
		console.log('Feed: ' + feedList.length);
		if (feedList === null) return <li>No posts yet.</li>;
		console.log(feedList[0]);
		return feedList.map((post) => (
			<li key={post}>
				<Link to='/'>
					<strong>{post.title}</strong> - Posted By{' '}
					<strong>{post.creator}</strong> in{' '}
					<strong>{post.section_name}</strong>
				</Link>
			</li>
		));
	}

	if (!feedLoaded) return <Spinner />;

	return <ul>{getFeed()}</ul>;
};

export default Feed;
