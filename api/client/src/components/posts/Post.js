import React, { useContext, useState, useEffect, Fragment } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useHistory,
	Link,
} from 'react-router-dom';
const MAX_POST_LENGTH = 5;
const Post = ({ post, getUser }) => {
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [posterName, setPosterName] = useState('');
	const { body } = post;
	const getUserName = (id) => {
		setLoading(true);
		getUser(id)
			.then((response) => {
				const { name } = response;
				setLoading(false);
				setPosterName(name);
			})
			.catch((err) => {
				return err;
			});
	};
	useEffect(() => {
		getUserName(post.creator);
		// eslint-disable-next-line
	}, []);
	const onFocus = (e) => {
		setShowMore(true);
	};
	const onBlur = (e) => {
		setShowMore(false);
	};
	if (loading || posterName === '') return <h3>Loading...</h3>;

	const getPostBody = () => {
		if (body.length <= MAX_POST_LENGTH || showMore) {
			return <p>{body}</p>;
		}
		const toShow = body.substring(0, MAX_POST_LENGTH) + '...';
		return <p>{toShow}</p>;
	};

	return (
		<div
			className={showMore ? 'Post-List-Item-Expanded' : 'Post-List-Item'}
		>
			<div>
				<h2 onClick={() => setShowMore(!showMore)}>
					<i
						className={
							showMore
								? 'fas fa-chevron-right Post-List-Item-Icon-Active'
								: 'fas fa-chevron-right Post-List-Item-Icon'
						}
					/>
				</h2>
			</div>
			<div>
				<h2>
					<Link to={'/'}>{post.title}</Link>{' '}
					<span className='poster-name'>
						<a href='#'>{posterName}</a>
					</span>
				</h2>
				{getPostBody()}
			</div>
		</div>
	);
};

export default Post;
