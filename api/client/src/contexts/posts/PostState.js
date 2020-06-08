import React, { useReducer } from 'react';
import postContext from './postContext';
import postReducer from './postReducer';
import axios from 'axios';

import {
	ADD_POST,
	DELETE_POST,
	POST_ERROR,
	UPDATE_POST,
	GET_POST,
	GET_POSTS,
	GET_FEED_POSTS,
	CLEAR_POST,
	CLEAR_POSTS,
	SET_LOADING,
} from '../types';

const PostState = (props) => {
	const initialState = {
		post: null,
		posts: null,
		feed_posts: null,
		error: null,
		loading: true,
	};
	const [state, dispatch] = useReducer(postReducer, initialState);
	const setLoading = () => dispatch({ type: SET_LOADING });
	//* Get Post
	const getPost = async (id) => {
		try {
			const res = await axios.get('/api/post/' + id);
			dispatch({
				type: GET_POST,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: POST_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const getFeedPosts = async (subbed_sections) => {
		try {
			let subs = '';
			if (subbed_sections === null) return null;

			for (let sub in subbed_sections) {
				if (subs === '') {
					if (subbed_sections[sub] === 1) subs = sub;
				} else {
					if (subbed_sections[sub] === 1) subs = subs + '/' + sub;
				}
			}
			const res = await axios.get('/api/posts/feed?subs=' + subs);

			dispatch({
				type: GET_FEED_POSTS,
				payload: res.data,
			});
			return res.data;
		} catch (err) {
			dispatch({
				type: POST_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get Posts
	const getPosts = async (section_id) => {
		try {
			const res = await axios.get('/api/posts/' + section_id);

			dispatch({
				type: GET_POSTS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: POST_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Clear Post
	const clearPost = async () => {
		dispatch({ type: CLEAR_POST, payload: null });
	};
	//* Clear Posts
	const clearPosts = async () => {
		dispatch({ type: CLEAR_POSTS, payload: null });
	};
	//* Add post
	const addPost = async (post) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.post('/api/post', post, config);

			dispatch({ type: ADD_POST, payload: res.data });
		} catch (err) {
			dispatch({ type: POST_ERROR, payload: err.response.msg });
		}
	};
	//* Delete Post
	const deletePost = async (id) => {
		try {
			await axios.delete(`/api/post/${id}`);

			dispatch({ type: DELETE_POST, payload: id });
		} catch (err) {
			dispatch({ type: POST_ERROR, payload: err.response.msg });
		}

		dispatch({ type: DELETE_POST, payload: id });
	};
	//* Update Post
	const updatePost = async (post) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(`/api/post/${post.id}`, post, config);

			dispatch({ type: UPDATE_POST, payload: res.data });
		} catch (err) {
			dispatch({ type: POST_ERROR, payload: err.response.msg });
		}
	};
	return (
		<postContext.Provider
			value={{
				post: state.post,
				posts: state.posts,
				feed_posts: state.feed_posts,
				error: state.error,
				loading: state.loading,
				addPost,
				deletePost,
				updatePost,
				getPost,
				getPosts,
				getFeedPosts,
				clearPost,
				clearPosts,
				setLoading,
			}}
		>
			{props.children}
		</postContext.Provider>
	);
};

export default PostState;
