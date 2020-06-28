import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import UserContext from '../../contexts/users/userContext';
import Profile_Default from '../pages/profile_default.svg';
const Conversations = ({ setSelectedConversation }) => {
	const authContext = useContext(AuthContext);
	const userContext = useContext(UserContext);
	const alertContext = useContext(AlertContext);
	const [selectedConvo, setSelectedConvo] = useState(null);
	const [conversations, setConversations] = useState(null);
	const { isAuthenticated, user } = authContext;
	const { getConversations } = userContext;
	const [hasConversations, setHasConversations] = useState(false);
	const loadConversations = () => {
		getConversations().then((res) => {
			if (res) {
				setHasConversations(true);
				setConversations(res);
				setSelectedConvo(selectedConvo);
				setSelectedConversation(res[0]);
			}
			//loadMessages(res[0].id);
		});
	};
	const changeConversation = (convo) => {
		setSelectedConvo(selectedConvo);
		setSelectedConversation(convo);
		//loadMessages(convo.id);
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

	const renderConversations = () => {
		if (!hasConversations || !conversations) {
			return <li>No conversations yet.</li>;
		}
		if (conversations)
			if (conversations.length === 0)
				return <li>No conversations yet.</li>;

		let returnValue = [];
		if (conversations !== null) {
			for (let key in conversations) {
				let value = (
					<li
						key={key}
						onClick={() => changeConversation(conversations[key])}
						className={
							selectedConvo !== null &&
							conversations[key].id === selectedConvo.id
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

	return <ul>{renderConversations()}</ul>;
};

export default Conversations;
