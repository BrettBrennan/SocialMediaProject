import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import Message from '../layout/Message';
import Conversations from '../layout/Conversations';
import Spinner from '../layout/Spinner';

const Messages = (props) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, user } = authContext;
	const [selectedConversation, setSelectedConversation] = useState(null);
	useEffect(() => {
		let mounted = true;
		if (!isAuthenticated) {
			props.history.push('/');
		}
		if (mounted) {
			if (!isAuthenticated || !user) authContext.loadUser();
		}
		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	if (authContext.loading) return <Spinner />;

	return (
		<div className='Messages-Container'>
			<div>
				<Conversations
					setSelectedConversation={(value) =>
						setSelectedConversation(value)
					}
				/>
			</div>
			<div className='Messages-List'>
				<Message selectedConversation={selectedConversation} />
			</div>
		</div>
	);
};

export default Messages;
