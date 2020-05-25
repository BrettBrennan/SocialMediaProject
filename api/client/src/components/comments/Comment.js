import React, { useContext, useState, useEffect, Fragment } from 'react';

const Comment = ({ comment, getUser }) => {
	const [posterName, setPosterName] = useState('');
	const [loading, setLoading] = useState(false);
	const getUserName = (id) => {
		setLoading(true);
		getUser(id)
			.then((response) => {
				const { name } = response;
				setLoading(false);
				setPosterName(name);
			})
			.catch((err) => {
				return err;
			});
	};
	useEffect(() => {
		getUserName(comment.creator);
		// eslint-disable-next-line
	}, []);
	if (loading || posterName === '') return <h3>Loading...</h3>;
	return (
		<div className='Post-Comment'>
			<p>
				<span className='font-weight-bold'>{posterName}</span> -{' '}
				{comment.msg}
			</p>
		</div>
	);
};

export default Comment;
