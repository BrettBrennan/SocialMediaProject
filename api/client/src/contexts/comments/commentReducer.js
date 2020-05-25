import {
	ADD_COMMENT,
	DELETE_COMMENT,
	COMMENT_ERROR,
	UPDATE_COMMENT,
	GET_COMMENTS,
	CLEAR_COMMENTS,
	SET_LOADING,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case GET_COMMENTS:
			return {
				...state,
				comments: action.payload,
				loading: false,
			};
		case ADD_COMMENT:
			return { ...state, comments: [action.payload, ...state.comments] };
		case UPDATE_COMMENT:
			return {
				...state,
				comments: state.comments.map((comment) =>
					comment.id === action.payload.id ? action.payload : comment
				),
				loading: false,
			};
		case DELETE_COMMENT:
			return {
				...state,
				comments: state.comments.filter(
					(comment) => comment.id !== action.payload
				),
				loading: false,
			};
		case CLEAR_COMMENTS:
			return {
				...state,
				comments: null,
				error: null,
				loading: false,
			};
		case COMMENT_ERROR:
			return {
				...state,
				error: action.payload,
			};
		default:
			return state;
	}
};
