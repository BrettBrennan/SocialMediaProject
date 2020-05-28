import React, {
	useContext,
	useRef,
	useState,
	useEffect,
	Fragment,
} from 'react';
import AuthContext from '../../contexts/auth/authContext';
import CommentContext from '../../contexts/comments/commentContext';
import AlertContext from '../../contexts/alert/alertContext';
import Comment from '../comments/Comment';
import { BrowserRouter as Router, Link } from 'react-router-dom';
const MAX_POST_LENGTH = 100;
const Post = ({ post, getUser, updatePost, deletePost }) => {
	const _isMounted = useRef(true);
	const authContext = useContext(AuthContext);
	const commentContext = useContext(CommentContext);
	const alertContext = useContext(AlertContext);
	//
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editFields, setEditFields] = useState({
		title: '',
		body: '',
	});
	const [posterName, setPosterName] = useState('');
	const [postComments, setPostComments] = useState(null);
	const [comment, setComment] = useState('');
	//
	const { title, body } = post;
	const { isAuthenticated, user } = authContext;
	const {
		getComments,
		addComment,
		updateComment,
		deleteComment,
		clearComments,
	} = commentContext;
	const { setAlert } = alertContext;
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
		if (_isMounted.current) {
			getUserName(post.creator);
			getComments(post.id)
				.then((response) => {
					setPostComments(response);
				})
				.catch((err) => {
					console.error(err);
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
			title: title,
			body: body,
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
		if (postComments === null) {
			return null;
		}
		return (
			<p>
				0 likes | {postComments !== null ? postComments.length : 0}{' '}
				comment
				{postComments !== null && postComments.length > 1 ? 's' : ''}
			</p>
		);
	};
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
			<div
				className={
					showMore ? 'Post-List-Item-Expanded' : 'Post-List-Item'
				}
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
					<div className='Post-Head'>
						<div className='Post-Title'>
							<h2>
								{' '}
								<Link to={'/'}>{post.title}</Link>
								<span className='poster-tag'>Posted By:</span>
								<span className='poster-name'>
									<a onClick={getCommentCount}>
										{posterName}
									</a>
								</span>
							</h2>
						</div>
						{showPostButtons()}
					</div>

					<span className='poster-date'>
						Posted on:{' '}
						{new Intl.DateTimeFormat('en-US', {
							year: 'numeric',
							month: 'long',
							day: '2-digit',
						}).format(Date.parse(post.createdAt))}
					</span>

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
							{(postComments !== null && postComments.length) >
								0 && renderComments()}
						</ul>
					) : (
						getPostInfo()
					)}
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
