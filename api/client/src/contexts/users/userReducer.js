import { GET_USER, GET_USERS, SET_LOADING, UPDATE_USER } from '../types';

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
		default:
			return state;
	}
};
