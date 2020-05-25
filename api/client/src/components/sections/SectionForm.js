import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import SectionContext from '../../contexts/sections/sectionContext';
const SectionForm = () => {
	const authContext = useContext(AuthContext);
	const sectionContext = useContext(SectionContext);
	const { addSection, clearSection, setLoading, loading } = sectionContext;
	useEffect(() => {
		authContext.loadUser();
		// eslint-disable-next-line
	}, []);

	const [section, setSection] = useState({
		title: '',
		desc: '',
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

	const { title, desc } = section;
	const onChange = (e) => {
		setSection({ ...section, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading();
		clearSection();
		addSection(section);
		setSection({
			title: '',
			desc: '',
		});
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
					<label htmlFor='desc'>Section Description</label>
					<input
						type='text'
						name='desc'
						value={desc}
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
