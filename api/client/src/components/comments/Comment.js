import React, { useContext, useState, useEffect } from 'react';

import AuthContext from '../../contexts/auth/authContext';
// import AlertContext from '../../contexts/alert/alertContext';
import NewLineToBr from '../Formatters';
const Comment = ({
	comment,
	getUser,
	updateComment,
	deleteComment,
	refreshComments,
}) => {
	const authContext = useContext(AuthContext);
	//const alertContext = useContext(AlertContext);
	//
	const { user } = authContext;
	//const { setAlert } = alertContext;
	//
	const [posterName, setPosterName] = useState('');
	const [commentValue, setCommentValue] = useState('');

	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(false);

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
	const onChange = (e) => {
		setCommentValue(e.target.value);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		let newComment = comment;
		newComment.msg = commentValue;
		updateComment(newComment);
		setEditing(false);
	};
	const editCom = () => {
		setEditing(true);
		setCommentValue(comment.msg);
	};
	const deleteCom = () => {
		setEditing(false);
		setCommentValue('');
		deleteComment(comment.id);
		refreshComments(comment);
	};
	const cancel = () => {
		setEditing(false);
		setCommentValue('');
	};
	const renderButtons = () => {
		if (user !== null) {
			if (user.id === comment.creator) {
				return (
					<div className='Post-Buttons'>
						<span className='Edit-Btn' onClick={() => editCom()}>
							<i className='fas fa-edit' /> Edit
						</span>
						<span
							className='Delete-Btn'
							onClick={() => deleteCom()}
						>
							<i className='fas fa-trash' /> Delete
						</span>
					</div>
				);
			}
		}
	};
	if (editing) {
		return (
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<textarea
						type='text'
						name='title'
						value={commentValue}
						onChange={onChange}
						required
					></textarea>
				</div>
				<button type='submit' className='btn btn-primary'>
					Update
				</button>
				<button onClick={cancel} className='btn btn-danger'>
					Cancel
				</button>
			</form>
		);
	}
	return (
		<div className='Post-Comment'>
			<div>
				<span className='font-weight-bold'>{posterName}</span> -
				{' 15 minutes ago'}
				<br />
				<NewLineToBr>{comment.msg}</NewLineToBr>
			</div>

			{renderButtons()}
		</div>
	);
};

export default Comment;
