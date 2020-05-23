import {
	ADD_SECTION,
	DELETE_SECTION,
	UPDATE_SECTION,
	SECTION_ERROR,
	GET_SECTION,
	GET_SECTIONS,
	CLEAR_SECTION,
	CLEAR_SECTIONS,
	SET_LOADING,
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case GET_SECTION:
			return {
				...state,
				section: action.payload,
				loading: false,
			};
		case GET_SECTIONS:
			return {
				...state,
				sections: action.payload,
				loading: false,
			};
		case ADD_SECTION:
			return { ...state, sections: [action.payload, ...state.sections] };
		case UPDATE_SECTION:
			return {
				...state,
				sections: state.sections.map((section) =>
					section.id === action.payload.id ? action.payload : section
				),
				loading: false,
			};
		case DELETE_SECTION:
			return {
				...state,
				sections: state.sections.filter(
					(section) => section.id !== action.payload
				),
				loading: false,
			};
		case CLEAR_SECTION:
			return {
				...state,
				section: null,
				error: null,
				loading: false,
			};
		case CLEAR_SECTIONS:
			return {
				...state,
				sections: null,
				section: null,
				error: null,
				loading: false,
			};
		case SECTION_ERROR:
			return {
				...state,
				error: action.payload,
			};
		default:
			return state;
	}
};
