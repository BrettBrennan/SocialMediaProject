import {
	ADD_POST,
	DELETE_POST,
	UPDATE_POST,
	POST_ERROR,
	GET_POST,
	GET_POSTS,
	GET_FEED_POSTS,
	CLEAR_POST,
	CLEAR_POSTS,
	SET_LOADING,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case GET_POST:
			return {
				...state,
				post: action.payload,
				loading: false,
			};
		case GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false,
			};
		case GET_FEED_POSTS:
			return {
				...state,
				feed_posts: action.payload,
				loading: false,
			};
		case ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
				loading: false,
			};
		case UPDATE_POST:
			return {
				...state,
				posts: state.posts.map((post) =>
					post.id === action.payload.id ? action.payload : post
				),
				loading: false,
			};
		case DELETE_POST:
			return {
				...state,
				posts: state.posts.filter((post) => post.id !== action.payload),
				loading: false,
			};
		case CLEAR_POST:
			return {
				...state,
				post: null,
				error: null,
				loading: false,
			};
		case CLEAR_POSTS:
			return {
				...state,
				posts: null,
				post: null,
				error: null,
				loading: false,
			};
		case POST_ERROR:
			return {
				...state,
				error: action.payload,
			};
		default:
			return state;
	}
};
