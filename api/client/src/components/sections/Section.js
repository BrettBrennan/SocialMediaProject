import React, { useContext, useState, useEffect, Fragment } from 'react';

import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import SectionContext from '../../contexts/sections/sectionContext';
import PostContext from '../../contexts/posts/postContext';

import Post from '../posts/Post';
import Spinner from '../layout/Spinner';

const Section = ({ match }) => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const sectionContext = useContext(SectionContext);
	const postContext = useContext(PostContext);

	const [createPost, setCreatePost] = useState(false);

	const {
		section,
		clearSection,
		getSection,
		setLoading,
		loading,
		error,
	} = sectionContext;

	const { isAuthenticated } = authContext;
	const { getUser } = userContext;
	const { posts, addPost, getPosts, clearPosts } = postContext;
	const { secID } = match.params;

	const [post, setPost] = useState({
		section: secID,
		title: '',
		body: '',
	});
	const { title, body } = post;

	useEffect(() => {
		authContext.loadUser();
		clearSection();
		setLoading();
		if (secID !== '') {
			getSection(secID);
			getPosts(secID);
		}
		// eslint-disable-next-line
	}, []);

	const onChange = (e) => {
		setPost({ ...post, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();

		if (title !== '' && body !== '') {
			//setLoading();
			addPost(post);
			setPost({
				section: secID,
				title: '',
				body: '',
			});

			setCreatePost(false);
			clearPosts();
			getPosts(secID);
		}
	};
	const cancelPost = (e) => {
		setPost({
			section: secID,
			title: '',
			body: '',
		});
		setCreatePost(false);
	};

	if (error) {
		return <h1>error</h1>;
	}

	if (createPost) {
		return (
			<div className='Create-Post'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Post Title</label>
						<input
							type='text'
							name='title'
							value={title}
							onChange={onChange}
							required
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='description'>Post Contents</label>
						<textarea
							name='body'
							value={body}
							onChange={onChange}
							required
						></textarea>
					</div>
					<button type='submit' className='btn btn-primary btn-lg'>
						Create Post
					</button>
					<button
						onClick={cancelPost}
						className='btn btn-primary btn-lg'
					>
						Cancel
					</button>
				</form>
			</div>
		);
	}

	if ((section === null || section.length === null) && !loading) {
		return <h1>This section doesn't exist yet! Try making one.</h1>;
	}

	if (loading) {
		return (
			<Fragment>
				<Spinner />
			</Fragment>
		);
	}

	const renderPosts = () => {
		if (posts !== null && posts.length !== 0) {
			return posts.map((post) => (
				<li>
					<Post post={post} getUser={getUser} />
				</li>
			));
		} else {
			return <h3>No posts yet.</h3>;
		}
	};

	return (
		<div className='Section'>
			<h1>{section.title}</h1>
			<h2>{section.description}</h2>
			<ul className='Post-List'>{renderPosts()}</ul>
			{isAuthenticated && (
				<a href='#' onClick={() => setCreatePost(true)}>
					<h3>
						<i className='fas fa-plus-square' /> Create New Post
					</h3>
				</a>
			)}
		</div>
	);
};

export default Section;
