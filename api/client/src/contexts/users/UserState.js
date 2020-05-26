import React, { useReducer } from 'react';
import userContext from './userContext';
import userReducer from './userReducer';
import axios from 'axios';

import {
	GET_USER,
	GET_USERS,
	SET_LOADING,
	USER_ERROR,
	UPDATE_USER,
} from '../types';

const UserState = (props) => {
	const initialState = {
		user: null,
		users: null,
		error: null,
		loading: true,
	};
	const [state, dispatch] = useReducer(userReducer, initialState);
	const setLoading = () => dispatch({ type: SET_LOADING });
	//* Get User
	const getUser = async (id) => {
		try {
			const res = await axios.get('/api/user/' + id);
			return res.data;
			//dispatch({
			//	type: GET_USER,
			//	payload: res.data,
			//});
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get Users
	const getUsers = async () => {
		try {
			const res = await axios.get('/api/users/');

			dispatch({
				type: GET_USERS,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Update User
	const updateUser = async (id, Subscribed_Section) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(
				`/api/user/${id}`,
				Subscribed_Section,
				config
			);
			dispatch({
				type: UPDATE_USER,
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	return (
		<userContext.Provider
			value={{
				user: state.user,
				users: state.users,
				error: state.error,
				loading: state.loading,
				getUser,
				getUsers,
				setLoading,
				updateUser,
			}}
		>
			{props.children}
		</userContext.Provider>
	);
};

export default UserState;
