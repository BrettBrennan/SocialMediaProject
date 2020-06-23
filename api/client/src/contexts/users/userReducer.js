import {
	LOAD,
	ADD_MESSAGE,
	GET_USER,
	GET_MESSAGES,
	MESSAGE_ERROR,
	GET_USERS,
	SET_LOADING,
	USER_ERROR,
	UPDATE_USER,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case LOAD:
			return {
				...state,
				loading: false,
			};
		case UPDATE_USER:
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case GET_MESSAGES:
			return {
				...state,
				messages: action.payload,
				loading: false,
			};
		case ADD_MESSAGE:
			const msgs =
				state.messages === null
					? action.payload
					: [action.payload, ...state.messages];
			return {
				...state,
				messages: msgs,
				loading: false,
			};

		case MESSAGE_ERROR:
			return {
				...state,
				error: action.payload,
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
