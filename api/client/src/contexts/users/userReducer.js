import {
	GET_USER,
	GET_USERS,
	SET_LOADING,
	UPDATE_USER,
	USER_ERROR,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case UPDATE_USER:
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case GET_USER:
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case GET_USERS:
			return {
				...state,
				users: action.payload,
				loading: false,
			};
		case USER_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
			};
		default:
			return state;
	}
};
