import React, { useContext, useState, useEffect, Fragment } from 'react';
import CommentContext from '../../contexts/comments/commentContext';
import Comment from '../comments/Comment';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useHistory,
	Link,
} from 'react-router-dom';
const MAX_POST_LENGTH = 100;
const Post = ({ post, getUser }) => {
	const commentContext = useContext(CommentContext);
	//
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [posterName, setPosterName] = useState('');
	const [postComments, setPostComments] = useState(null);
	//
	const { body } = post;
	const { getComments } = commentContext;
	//
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
	//
	useEffect(() => {
		getUserName(post.creator);
		getComments(post.id)
			.then((response) => {
				setPostComments(response);
			})
			.catch((err) => {
				console.error(err);
			});

		// eslint-disable-next-line
	}, []);
	//
	if (loading || posterName === '') return <h3>Loading...</h3>;
	//
	const getPostBody = () => {
		if (body.length <= MAX_POST_LENGTH || showMore) {
			return <p>{body}</p>;
		}
		const toShow = body.substring(0, MAX_POST_LENGTH) + '...';
		return <p>{toShow}</p>;
	};
	const getCommentCount = () => {
		if (postComments === null) {
			console.log('Null Comments.');
		} else {
			console.log('Comments: ' + postComments.length);
		}
	};
	const getPostInfo = () => {
		return (
			<p>
				0 likes | {postComments !== null ? postComments.length : 0}{' '}
				comment
				{postComments !== null && postComments.length > 1 ? 's' : ''}
			</p>
		);
	};
	const renderComments = () => {
		return postComments.map((postComment) => (
			<li>
				<Comment comment={postComment} getUser={getUser} />
			</li>
		));
	};
	//
	return (
		<div
			onClick={() => setShowMore(!showMore)}
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
			<div className='Post-Body'>
				<h2>
					<Link to={'/'}>{post.title}</Link>{' '}
					<span className='poster-name'>
						<a onClick={getCommentCount}>{posterName}</a>
					</span>
				</h2>
				{getPostBody()}
				{showMore ? (
					postComments !== null && postComments.length > 0 ? (
						<ul className='Post-Comments-List'>
							{renderComments()}
						</ul>
					) : (
						<Fragment></Fragment>
					)
				) : (
					getPostInfo()
				)}
			</div>
		</div>
	);
};

export default Post;
