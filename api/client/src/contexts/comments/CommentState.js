import React, { useReducer } from 'react';
import commentContext from './commentContext';
import commentReducer from './commentReducer';
import axios from 'axios';

import {
	ADD_COMMENT,
	DELETE_COMMENT,
	COMMENT_ERROR,
	UPDATE_COMMENT,
	GET_COMMENTS,
	CLEAR_COMMENTS,
	SET_LOADING,
} from '../types';

const CommentState = (props) => {
	const initialState = {
		comments: null,
		error: null,
		loading: true,
	};
	const [state, dispatch] = useReducer(commentReducer, initialState);
	const setLoading = () => dispatch({ type: SET_LOADING });

	//* Get Comments
	const getComments = async (post_id) => {
		try {
			const res = await axios.get('/api/comments/' + post_id);
			dispatch({
				type: GET_COMMENTS,
				payload: res.data,
			});
			return res.data;
		} catch (err) {
			dispatch({
				type: COMMENT_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Clear Comments
	const clearComments = async () => {
		dispatch({ type: CLEAR_COMMENTS, payload: null });
	};
	//* Add comment
	const addComment = async (comment) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.comment('/api/comment', comment, config);

			dispatch({ type: ADD_COMMENT, payload: res.data });
		} catch (err) {
			dispatch({ type: COMMENT_ERROR, payload: err.response.msg });
		}
	};
	//* Delete Comment
	const deleteComment = async (id) => {
		try {
			await axios.delete(`/api/comment/${id}`);

			dispatch({ type: DELETE_COMMENT, payload: id });
		} catch (err) {
			dispatch({ type: COMMENT_ERROR, payload: err.response.msg });
		}

		dispatch({ type: DELETE_COMMENT, payload: id });
	};
	//* Update Comment
	const updateComment = async (comment) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(
				`/api/comment/${comment.id}`,
				comment,
				config
			);

			dispatch({ type: UPDATE_COMMENT, payload: res.data });
		} catch (err) {
			dispatch({ type: COMMENT_ERROR, payload: err.response.msg });
		}
	};
	return (
		<commentContext.Provider
			value={{
				comments: state.comments,
				error: state.error,
				loading: state.loading,
				addComment,
				deleteComment,
				updateComment,
				getComments,
				clearComments,
				setLoading,
			}}
		>
			{props.children}
		</commentContext.Provider>
	);
};

export default CommentState;
