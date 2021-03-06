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
	const [hasFeed, setHasFeed] = useState(false);
	const loadFeed = (user) => {
		if (!user) {
			console.error("User was null, couldn't load feed.");
			return null;
		}
		if (feedList && feedList.length > 0) return null;
		if (user.Subscribed_Sections) {
			postContext
				.getFeedPosts(user.Subscribed_Sections)
				.then((response) => {
					fillFeed(response);
					setFeedLoaded(true);
					setHasFeed(true);
				});
		} else {
			setFeedLoaded(true);
			setHasFeed(false);
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
			// eslint-disable-next-line
			feed.map((post) => {
				userContext.getUserName(post.creator).then((response2) => {
					sectionContext
						.getSectionName(post.section_id)
						.then((response3) => {
							setFeedList((feedList) => [
								...feedList,
								{
									id: post.id,
									creator_id: post.creator,
									creator: response2,
									section_id: post.section_id,
									section_name: response3,
									title: post.title,
								},
							]);
						});
				});
			});
			setHasFeed(true);
		}
	}
	function getFeed() {
		if (!hasFeed)
			return (
				<li>
					You have not subscribed to any sections yet. Head over to{' '}
					<Link to='/sections/'>Sections</Link> to find a section you
					like!
				</li>
			);

		if (feedList === null) return <li>No posts yet.</li>;
		return feedList.map((post) => (
			<li key={post.id}>
				<Link to={'/posts/' + post.id} className='Feed-Post-Title'>
					<strong>{post.title}</strong>
				</Link>{' '}
				- Posted By{' '}
				<Link
					to={'/user/' + post.creator_id}
					className='Feed-Post-Creator'
				>
					<strong>{post.creator}</strong>
				</Link>{' '}
				in{' '}
				<Link
					to={'/sections/s/' + post.section_id}
					className='Feed-Post-Section'
				>
					<strong>{post.section_name}</strong>
				</Link>
			</li>
		));
	}

	if (!feedLoaded) return <Spinner />;

	return <ul>{getFeed()}</ul>;
};

export default Feed;
