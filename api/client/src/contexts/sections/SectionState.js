import React, { useReducer } from 'react';
import sectionContext from './sectionContext';
import sectionReducer from './sectionReducer';
import axios from 'axios';

import {
	ADD_SECTION,
	DELETE_SECTION,
	SECTION_ERROR,
	UPDATE_SECTION,
	GET_SECTION,
	GET_SECTIONS,
	CLEAR_SECTION,
	CLEAR_SECTIONS,
	SET_LOADING,
} from '../types';

const SectionState = (props) => {
	const initialState = {
		section: null,
		sections: null,
		error: null,
		loading: true,
	};
	const [state, dispatch] = useReducer(sectionReducer, initialState);
	const setLoading = () => dispatch({ type: SET_LOADING });
	//* Get Section
	const getSection = async (id) => {
		try {
			const res = await axios.get('/api/section/' + id);
			dispatch({
				type: GET_SECTION,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: SECTION_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get Sections
	const getSections = async () => {
		try {
			const res = await axios.get('/api/sections');

			dispatch({
				type: GET_SECTIONS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: SECTION_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get Sections
	const getSectionsByUser = async (user_id) => {
		try {
			const res = await axios.get('/api/sections/' + user_id);

			dispatch({
				type: GET_SECTIONS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: SECTION_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Clear Section
	const clearSection = async () => {
		dispatch({ type: CLEAR_SECTION, payload: null });
	};
	//* Clear Sections
	const clearSections = async () => {
		dispatch({ type: CLEAR_SECTIONS, payload: null });
	};
	//* Add section
	const addSection = async (section) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await axios.post('/api/sections', section, config);

			dispatch({ type: ADD_SECTION, payload: res.data });
		} catch (err) {
			dispatch({ type: SECTION_ERROR, payload: err.response.msg });
		}
	};
	//* Delete Section
	const deleteSection = async (id) => {
		try {
			await axios.delete(`/api/sections/${id}`);

			dispatch({ type: DELETE_SECTION, payload: id });
		} catch (err) {
			dispatch({ type: SECTION_ERROR, payload: err.response.msg });
		}

		dispatch({ type: DELETE_SECTION, payload: id });
	};
	//* Update Section
	const updateSection = async (section) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(
				`/api/sections/${section.id}`,
				section,
				config
			);

			dispatch({ type: UPDATE_SECTION, payload: res.data });
		} catch (err) {
			dispatch({ type: SECTION_ERROR, payload: err.response.msg });
		}
	};
	return (
		<sectionContext.Provider
			value={{
				section: state.section,
				sections: state.sections,
				error: state.error,
				loading: state.loading,
				addSection,
				deleteSection,
				updateSection,
				getSection,
				getSections,
				getSectionsByUser,
				clearSection,
				clearSections,
				setLoading,
			}}
		>
			{props.children}
		</sectionContext.Provider>
	);
};

export default SectionState;
