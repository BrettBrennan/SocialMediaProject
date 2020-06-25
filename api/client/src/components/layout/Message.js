import React, { Fragment, useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';
import NewLineToBr from '../Formatters';
import Spinner from '../layout/Spinner';
import Profile_Default from '../pages/profile_default.svg';
const Message = ({ selectedConversation }) => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const alertContext = useContext(AlertContext);

	const [messages, setMessages] = useState(null);

	const { setAlert } = alertContext;
	const { user } = authContext;
	const [messageInput, setMessageInput] = useState('');
	const [loadingMessages, setLoadingMessages] = useState(false);

	const { getMessages, sendMessage, setMessagesAsRead } = userContext;

	const loadMessages = () => {
		if (!selectedConversation) return;
		setLoadingMessages(true);
		getMessages(selectedConversation.id).then(async (res) => {
			let _messages = [];
			for (let message in res) {
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
			setMessagesAsRead(selectedConversation.id);
			setLoadingMessages(false);
		});
	};
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			loadMessages();
		}
		return () => {
			mounted = false;
		};
	}, [selectedConversation]);
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
	return (
		<Fragment>
			{renderCurrentConvoUser()}
			<ul>{renderMessages()}</ul>
			<div>{renderForm()}</div>
		</Fragment>
	);
};

export default Message;
