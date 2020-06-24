import React, { useContext, useState, useEffect } from 'react';

import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';
import NewLineToBr from '../Formatters';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import Profile_Default from '../pages/profile_default.svg';
const Messages = () => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const alertContext = useContext(AlertContext);

	const [messages, setMessages] = useState(null);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [conversations, setConversations] = useState(null);
	const { isAuthenticated, user } = authContext;
	const { setAlert } = alertContext;
	const {
		getMessages,
		getConversations,
		sendMessage,
		setMessagesAsRead,
	} = userContext;
	const [messageInput, setMessageInput] = useState('');
	const [loadingMessages, setLoadingMessages] = useState(false);
	const loadMessages = (id) => {
		setLoadingMessages(true);
		getMessages(id).then(async (res) => {
			let _messages = [];
			for (let message in res) {
				console.log(res[message]);
				let name = await userContext.getUserName(res[message].sender);
				const newMessage = {
					id: res[message].id,
					sender: res[message].sender,
					name: name,
					message: res[message].message,
				};

				_messages = [..._messages, newMessage];
			}
			setMessages(_messages);
			setMessagesAsRead(id);
			setLoadingMessages(false);
		});
	};
	const loadConversations = () => {
		getConversations().then(async (res) => {
			setConversations(res);
			setSelectedConversation(res[0]);
			loadMessages(res[0].id);
		});
	};
	const changeConversation = (convo) => {
		setSelectedConversation(convo);
		loadMessages(convo.id);
	};
	useEffect(() => {
		let mounted = true;

		if (mounted) {
			if (!isAuthenticated || !user)
				authContext.loadUser().then(() => {
					loadConversations();
				});
			else loadConversations();
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	if (authContext.loading || userContext.loading) return <Spinner />;

	const onChange = (e) => {
		setMessageInput(e.target.value);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		sendMessage(selectedConversation.id, messageInput).then(async () => {
			setAlert('Message Sent!', 'success');
			await loadMessages(selectedConversation.id);
		});

		setMessageInput('');
	};

	const renderConversations = () => {
		let returnValue = [];
		if (conversations !== null) {
			for (let key in conversations) {
				let value = (
					<li
						key={key}
						onClick={() => changeConversation(conversations[key])}
						className={
							selectedConversation !== null &&
							conversations[key].id === selectedConversation.id
								? 'Conversation-List-Item Current'
								: 'Conversation-List-Item'
						}
					>
						<img
							src={
								conversations[key].profile_pic !== ''
									? conversations[key].profile_pic
									: Profile_Default
							}
							className='Conversation-List-Img'
						/>
						<div>
							<h3>{conversations[key].name}</h3>
							<p>{conversations[key].last_message}</p>
						</div>
					</li>
				);
				returnValue.push(value);
			}
		}
		return returnValue;
	};
	const renderCurrentConvoUser = () => {
		if (!selectedConversation) return null;

		return (
			<div className='Message-Header'>
				<img
					src={selectedConversation.profile_pic || Profile_Default}
					style={{ width: '64px', height: '64px' }}
				/>
				<h3>{selectedConversation.name}</h3>
			</div>
		);
	};
	const renderMessages = () => {
		let returnValue = [];
		if (loadingMessages) return <Spinner />;
		if (messages !== null) {
			for (let key in messages) {
				let value = (
					<li
						key={key}
						className={
							messages[key].sender === user.id
								? 'Message-User'
								: 'Message-Other'
						}
					>
						<NewLineToBr>{messages[key].message}</NewLineToBr>
					</li>
				);
				returnValue.push(value);
			}
		}

		return returnValue;
	};
	const renderForm = () => {
		return (
			<form onSubmit={onSubmit} className='Message-Form'>
				<input type='text' value={messageInput} onChange={onChange} />
				<button className='btn btn-success'>Send</button>
			</form>
		);
	};
	return (
		<div className='Messages-Container'>
			<div>
				<ul>{renderConversations()}</ul>
			</div>
			<div className='Messages-List'>
				{renderCurrentConvoUser()}
				<ul>{renderMessages()}</ul>
				<div>{renderForm()}</div>
			</div>
		</div>
	);
};

export default Messages;
