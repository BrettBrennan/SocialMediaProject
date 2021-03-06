import React, { useReducer } from 'react';
import userContext from './userContext';
import userReducer from './userReducer';
import axios from 'axios';

import {
	ADD_MESSAGE,
	GET_USER,
	GET_MESSAGES,
	MESSAGE_ERROR,
	GET_USERS,
	SET_LOADING,
	LOAD,
	USER_ERROR,
	UPDATE_USER,
} from '../types';

const UserState = (props) => {
	const initialState = {
		user: null,
		users: null,
		messages: null,
		error: null,
		loading: true,
	};
	const [state, dispatch] = useReducer(userReducer, initialState);
	const setLoading = () => dispatch({ type: SET_LOADING });
	const setMessagesAsRead = async (id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(`/api/messages/read/${id}`, config);
			return res.data;
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const sendMessage = async (id, message) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.post(
				'/api/messages',
				{
					receiver: id,
					message: message,
				},
				config
			);
			dispatch({ type: ADD_MESSAGE, payload: res.data });
		} catch (err) {
			dispatch({ type: MESSAGE_ERROR, payload: err.response.msg });
		}
	};
	const getUserName = async (id) => {
		try {
			const res = await axios.get('/api/user/' + id);
			return res.data.name;
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get User
	const getUser = async (id) => {
		try {
			const res = await axios.get('/api/user/' + id);

			dispatch({
				type: GET_USER,
				payload: res.data,
			});
			return res.data;
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
	const getConversations = async () => {
		try {
			const res = await axios.get('/api/messages/conversations/');
			dispatch({
				type: LOAD,
			});
			return res.data;
		} catch (err) {
			dispatch({
				type: MESSAGE_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const getUnreadMessages = async (user_id) => {
		try {
			const res = await axios.get('/api/messages/unread/' + user_id);
			return res.data;
		} catch (err) {
			dispatch({
				type: MESSAGE_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Get Messages
	// ? user_id is OTHER user, not the logged in user.
	const getMessages = async (user_id) => {
		try {
			const res = await axios.get('/api/messages/user/' + user_id);
			dispatch({
				type: GET_MESSAGES,
				payload: res.data,
			});
			return res.data;
		} catch (err) {
			dispatch({
				type: MESSAGE_ERROR,
				payload: err.response.msg,
			});
		}
	};
	//* Update User
	const updateUser = async (id, Payload) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const res = await axios.put(`/api/user/${id}`, Payload, config);
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
	const blockUser = async (other_id, id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const gUser = await axios.get('/api/user/' + id);

			if (gUser) {
				let bList = null;
				if (gUser.data.blocked !== null) bList = gUser.data.blocked;

				bList = { ...bList, [other_id]: 1 };

				const Payload = { type: 'blocked', payload: bList };
				const res = await axios.put(`/api/user/${id}`, Payload, config);
				await removeFriend(other_id, id);
				await removeFriend(id, other_id);
				return res.data;
			}
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const unBlockUser = async (other_id, id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const gUser = await axios.get('/api/user/' + id);

			if (gUser) {
				let bList = null;
				bList = gUser.data.blocked;

				if (bList) if (bList[other_id]) delete bList[other_id];

				if (JSON.stringify(bList) === '{}') bList = null;

				const Payload = { type: 'blocked', payload: bList };
				const res = await axios.put(`/api/user/${id}`, Payload, config);
				return res.data;
			}
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const removeFriend = async (other_id, id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const gUser = await axios.get('/api/user/' + other_id);

			if (gUser) {
				let fList = null;
				fList = gUser.data.friends;

				if (fList) if (fList[id]) delete fList[id];

				if (JSON.stringify(fList) === '{}') fList = null;

				const Payload = { type: 'friends', payload: fList };
				const res = await axios.put(
					`/api/user/${other_id}`,
					Payload,
					config
				);
				dispatch({
					type: UPDATE_USER,
					payload: res.data,
				});
			}
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: err.response.msg,
			});
		}
	};
	const acceptFriendRequest = async (id, currentUser) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const gUser = await axios.get('/api/user/' + id);

			if (gUser) {
				let fList = null;
				if (gUser.data.friends !== null) fList = gUser.data.friends;

				fList = { ...fList, [currentUser]: 1 };

				const Payload = { type: 'friends', payload: fList };
				const res = await axios.put(`/api/user/${id}`, Payload, config);
				dispatch({
					type: UPDATE_USER,
					payload: res.data,
				});
			}
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
				messages: state.messages,
				error: state.error,
				loading: state.loading,
				getConversations,
				getMessages,
				getUnreadMessages,
				setMessagesAsRead,
				sendMessage,
				getUserName,
				getUser,
				getUsers,
				setLoading,
				updateUser,
				removeFriend,
				acceptFriendRequest,
				blockUser,
				unBlockUser,
			}}
		>
			{props.children}
		</userContext.Provider>
	);
};

export default UserState;
