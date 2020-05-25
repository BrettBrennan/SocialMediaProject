import React, { useContext, useState, useEffect, Fragment } from 'react';
import AuthContext from '../../contexts/auth/authContext';
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
	const authContext = useContext(AuthContext);
	const commentContext = useContext(CommentContext);
	//
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [posterName, setPosterName] = useState('');
	const [postComments, setPostComments] = useState(null);
	const [comment, setComment] = useState('');
	//
	const { body } = post;
	const { isAuthenticated } = authContext;
	const { getComments, addComment, clearComments } = commentContext;
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
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const com = {
			post: post.id,
			msg: comment,
		};
		addComment(com);
		setComment('');
		getComments(post.id)
			.then((response) => {
				setPostComments(response);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const onChange = (e) => {
		setComment(e.target.value);
	};
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
					<span className='poster-date'>
						Posted on:{' '}
						{new Intl.DateTimeFormat('en-US', {
							year: 'numeric',
							month: 'long',
							day: '2-digit',
						}).format(Date.parse(post.createdAt))}
					</span>
				</h2>
				{getPostBody()}
				{showMore ? (
					<ul className='Post-Comments-List'>
						{isAuthenticated && (
							<li>
								<form onSubmit={onSubmit}>
									<div className='form-group'>
										<label htmlFor='comment'>
											Add Comment
										</label>
										<textarea
											name='comment'
											onChange={onChange}
											value={comment}
											required
										></textarea>
										<br />
										<button
											type='submit'
											className='btn btn-primary btn-lg'
										>
											Comment
										</button>
									</div>
								</form>
								Comments:
								{(postComments !== null &&
									postComments.length) > 0
									? postComments.length
									: ' 0'}
							</li>
						)}
						{(postComments !== null && postComments.length) > 0 &&
							renderComments()}
					</ul>
				) : (
					getPostInfo()
				)}
			</div>
		</div>
	);
};

export default Post;
