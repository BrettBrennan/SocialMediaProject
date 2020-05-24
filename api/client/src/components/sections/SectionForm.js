import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';

const SectionForm = () => {
	const authContext = useContext(AuthContext);

	useEffect(() => {
		authContext.loadUser();
		// eslint-disable-next-line
	}, []);

	const [section, setSection] = useState({
		title: '',
		description: '',
	});
	const { isAuthenticated } = authContext;

	if (!isAuthenticated) {
		return (
			<div>
				<h2>Want to create your own?</h2>
				<h3>
					<a href='#'>Log in now to access this feature.</a>
				</h3>
			</div>
		);
	}

	const { title, description } = section;
	const onChange = (e) => {
		setSection({ ...section, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div>
			<h2>Create your own!</h2>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label htmlFor='title'>Section Title</label>
					<input
						type='text'
						name='title'
						value={title}
						onChange={onChange}
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='description'>Section Description</label>
					<input
						type='text'
						name='description'
						value={description}
						onChange={onChange}
						required
					/>
				</div>
				<button type='submit' className='btn btn-primary btn-block'>
					Create
				</button>
			</form>
		</div>
	);
};

export default SectionForm;
