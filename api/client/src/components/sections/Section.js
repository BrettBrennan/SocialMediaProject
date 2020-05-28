import React, {
	useContext,
	useState,
	useEffect,
	useRef,
	Fragment,
} from 'react';

import AuthContext from '../../contexts/auth/authContext';
import UserContext from '../../contexts/users/userContext';
import SectionContext from '../../contexts/sections/sectionContext';
import PostContext from '../../contexts/posts/postContext';

import Post from '../posts/Post';
import Spinner from '../layout/Spinner';

const Section = ({ match }) => {
	const _isMounted = useRef(true);

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

	const { isAuthenticated, user } = authContext;
	const { getUser, updateUser } = userContext;
	const {
		posts,
		addPost,
		getPosts,
		clearPosts,
		updatePost,
		deletePost,
	} = postContext;
	const { secID } = match.params;

	const [post, setPost] = useState({
		section: secID,
		title: '',
		body: '',
	});
	const { title, body } = post;
	const [newSubs, setNewSubs] = useState(null);
	useEffect(() => {
		if (_isMounted.current) {
			authContext.loadUser();
			clearSection();
			setLoading();
			if (secID !== '') {
				getSection(secID);
				getPosts(secID);
			}
			if (user !== null) setNewSubs(user.Subscribed_Sections);
		}
		return () => (_isMounted.current = false);
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
				<li key={post.id}>
					<Post
						post={post}
						getUser={getUser}
						updatePost={updatePost}
						deletePost={deletePost}
					/>
				</li>
			));
		} else {
			return <h3>No posts yet.</h3>;
		}
	};
	const isSubscribed = () => {
		if (newSubs !== null) {
			return newSubs[secID] === 1;
		}
		if (user !== null && user.Subscribed_Sections !== null)
			setNewSubs(user.Subscribed_Sections);

		if (newSubs === null) return false;
		if (newSubs[secID] === 1) return true;
		else return false;

		return false;
	};
	const subscribe = () => {
		if (user === null) return;
		let newSub = {
			[secID]: 0,
		};
		if (user !== null && newSubs === null) {
			if (user.Subscribed_Sections !== null) {
				newSub = user.Subscribed_Sections;
				newSub[secID] = user.Subscribed_Sections === 1 ? 0 : 1;
				setNewSubs(newSub);
			}
		} else if (newSubs !== null) {
			newSub = newSubs;
			newSub[secID] = newSubs[secID] === 1 ? 0 : 1;
			setNewSubs(newSub);
		}
		updateUser(user.id, newSubs);
	};
	return (
		<div className='Section'>
			<h1>{section.title}</h1>
			<h2>{section.description}</h2>
			{isAuthenticated && (
				<button
					className={
						isSubscribed()
							? 'Sub-btn subscribed'
							: 'Sub-btn unsubscribed'
					}
					onClick={subscribe}
				>
					{isSubscribed() ? 'Unsubscribe' : 'Subscribe'}
				</button>
			)}
			<br />
			<ul className='Post-List'>
				<li>
					{' '}
					{isAuthenticated && (
						<button
							className='btn btn-outline-primary'
							href='#'
							onClick={() => setCreatePost(true)}
						>
							<i className='fas fa-plus-square' /> Create New Post
						</button>
					)}
				</li>
				{renderPosts()}
			</ul>
		</div>
	);
};

export default Section;
