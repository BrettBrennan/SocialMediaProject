import React, { useContext, useRef, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import CommentContext from '../../contexts/comments/commentContext';
import PostContext from '../../contexts/posts/postContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';
import Comment from '../comments/Comment';
import NewLineToBr from '../Formatters';

import { Link } from 'react-router-dom';
const Post = ({ match }) => {
	const _isMounted = useRef(true);
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const commentContext = useContext(CommentContext);
	const postContext = useContext(PostContext);
	const alertContext = useContext(AlertContext);
	//
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [posterName, setPosterName] = useState('');
	const [editFields, setEditFields] = useState({
		title: '',
		body: '',
	});
	const [postComments, setPostComments] = useState(null);
	const [comment, setComment] = useState('');
	const [post, setPost] = useState({
		title: '',
		body: '',
	});
	//
	const { isAuthenticated, user } = authContext;
	const {
		getComments,
		addComment,
		updateComment,
		deleteComment,
	} = commentContext;
	const { getPost, updatePost, deletePost } = postContext;
	const { setAlert } = alertContext;
	const { getUser } = userContext;
	//
	const getUserName = (id) => {
		setLoading(true);
		getUser(id).then((response) => {
			if (response) setPosterName(response.name);
			setLoading(false);
		});
	};
	//
	useEffect(() => {
		if (_isMounted.current) {
			getPost(match.params.id).then((response) => {
				setPost(response);
				getUserName(response.creator);
				getComments(response.id)
					.then((response2) => {
						setPostComments(response2);
					})
					.catch((err) => {
						console.error(err);
					});
			});
		}
		return () => (_isMounted.current = false);
		// eslint-disable-next-line
	}, []);
	//
	const cancel = () => {
		setEditing(false);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (editing) {
			let newPost = post;
			newPost.title = editFields.title;
			newPost.body = editFields.body;
			updatePost(newPost);
		} else {
			const com = {
				post: post.id,
				msg: comment,
			};
			addComment(com).then(() => {
				setComment('');
				getComments(post.id)
					.then((response) => {
						setPostComments(response);
						setLoading(false);
					})
					.catch((err) => {
						console.error(err);
					});
			});
		}
	};
	const refreshComments = (comment) => {
		setPostComments(postComments.filter((com) => com.id !== comment.id));
	};
	const onChange = (e) => {
		if (editing)
			setEditFields({ ...editFields, [e.target.name]: e.target.value });
		else setComment(e.target.value);
	};
	//
	const editP = () => {
		setEditing(true);
		setEditFields({
			title: post.title,
			body: post.body,
		});
	};
	const deleteP = () => {
		if (post === null) return;
		if (window.confirm('Are you sure you want to delete this post?')) {
			deletePost(post.id);
			setAlert('Post Deleted!', 'success');
		}
	};
	//
	if (loading || posterName === '') return <h3>Loading...</h3>;
	//
	const getPostBody = () => {
		return (
			<p>
				<NewLineToBr>{post.body}</NewLineToBr>
			</p>
		);
	};
	// const getPostInfo = () => {
	// 	if (postComments === null) {
	// 		return null;
	// 	}
	// 	return (
	// 		<p>
	// 			0 likes | {postComments !== null ? postComments.length : 0}{' '}
	// 			comment
	// 			{postComments !== null && postComments.length > 1 ? 's' : ''}
	// 		</p>
	// 	);
	// };
	const renderEditForm = () => {
		return (
			<div className='Create-Post'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Post Title</label>
						<input
							type='text'
							name='title'
							value={editFields.title}
							onChange={onChange}
							required
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='description'>Post Body</label>
						<textarea
							type='text'
							name='body'
							value={editFields.body}
							onChange={onChange}
							required
						>
							{editFields.body}
						</textarea>
					</div>
					<button type='submit' className='btn btn-primary'>
						Update
					</button>
					<button onClick={cancel} className='btn btn-danger'>
						Cancel
					</button>
				</form>
			</div>
		);
	};
	const showPostButtons = () => {
		if (user !== null && isAuthenticated) {
			if (user.id === post.creator) {
				return (
					<div className='Post-Buttons'>
						<span className='Edit-Btn' onClick={editP}>
							<i className='fas fa-edit' /> Edit
						</span>
						<span className='Delete-Btn' onClick={deleteP}>
							<i className='fas fa-trash' /> Delete
						</span>
					</div>
				);
			}
		}
		return null;
	};
	const renderPost = () => {
		return (
			<div className='Post-Page'>
				<div className='Post-Page-Body'>
					<div className='Post-Page-Head'>
						<div className='Post-Page-Title'>
							<h2>
								{' '}
								<span className='Post-Title-Link'>
									{post.title}
								</span>
								<br />
								<span className='poster-tag'>Posted By:</span>
								<Link
									className='poster-name'
									to={'/user/' + post.creator}
								>
									{posterName}
								</Link>
								<span className='poster-date'>
									on:{' '}
									{new Intl.DateTimeFormat('en-US', {
										year: 'numeric',
										month: 'long',
										day: '2-digit',
									}).format(Date.parse(post.createdAt))}
								</span>
							</h2>
						</div>
						{showPostButtons()}
					</div>

					{getPostBody()}

					<ul className='Post-Page-Comments-List'>
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
				</div>
			</div>
		);
	};
	const renderComments = () => {
		if (postComments === null) return null;
		return postComments.map((postComment) => (
			<li key={postComment.id}>
				<Comment
					comment={postComment}
					getUser={getUser}
					updateComment={updateComment}
					deleteComment={deleteComment}
					refreshComments={refreshComments}
				/>
			</li>
		));
	};
	//
	return editing === true ? renderEditForm() : renderPost();
};

export default Post;
