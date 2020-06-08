import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alert/alertContext';
import SectionContext from '../../contexts/sections/sectionContext';
import Spinner from '../layout/Spinner';
import NewLineToBr from '../Formatters';
const SectionsList = ({ ownedByUser }) => {
	const authContext = useContext(AuthContext);
	const sectionContext = useContext(SectionContext);
	const alertContext = useContext(AlertContext);
	const { isAuthenticated, user } = authContext;
	const [editSection, setEditSection] = useState(null);
	const [editFields, setEditFields] = useState({
		title: '',
		description: '',
	});
	const [editing, setEditing] = useState(false);
	const {
		sections,
		getSections,
		getSectionsByUser,
		clearSection,
		updateSection,
		deleteSection,
		setLoading,
		loading,
	} = sectionContext;
	const { setAlert } = alertContext;
	useEffect(() => {
		let mounted = true;
		if (ownedByUser === true) {
			if (user !== null) {
				if (mounted) getSectionsByUser(user.id);
			}
		} else {
			if (mounted) getSections();
		}

		return () => (mounted = false);
		// eslint-disable-next-line
	}, []);
	if (ownedByUser === true && user === null) return null;
	if (ownedByUser && !isAuthenticated) return <Fragment></Fragment>;
	if (sections !== null && sections.length === null && !loading) {
		return <h4>No sections exist yet! Try making one.</h4>;
	}
	const cancel = () => {
		setEditing(false);
		setEditSection(null);
	};
	const onChange = (e) => {
		setEditFields({ ...editFields, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		let updatedSection = editSection;
		updatedSection.title = editFields.title;
		updatedSection.description = editFields.description;
		updateSection(updatedSection);

		cancel();
	};

	const editSec = (section) => {
		setEditing(true);
		setEditSection(section);
		setEditFields({
			title: section.title,
			description: section.description,
		});
	};
	const deleteSec = (section_id) => {
		if (window.confirm('Are you sure you want to delete this Section?')) {
			deleteSection(section_id);
			setAlert('Section Deleted!', 'danger');
		}
	};
	const renderEditSection = () => {
		return (
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label htmlFor='title'>Section Title</label>
					<input
						type='text'
						name='title'
						value={editFields.title}
						onChange={onChange}
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='description'>Section Description</label>
					<input
						type='text'
						name='description'
						value={editFields.description}
						onChange={onChange}
						required
					/>
				</div>
				<button type='submit' className='btn btn-primary'>
					Update
				</button>
				<button onClick={cancel} className='btn btn-danger'>
					Cancel
				</button>
			</form>
		);
	};
	const renderSection = (section) => {
		if (ownedByUser && isAuthenticated) {
			if (section.creator === user.id) {
				return (
					<li key={section.id} className='Section-List-Item'>
						{editing && section.id === editSection.id ? (
							renderEditSection()
						) : (
							<Fragment>
								{' '}
								<div className='Post-Head'>
									<div className='Post-Title'>
										<h2>
											<Link
												to={'/sections/s/' + section.id}
											>
												{section.title}
											</Link>
										</h2>
									</div>
									<br />
									<div className='Post-Buttons'>
										<span
											className='Edit-Btn'
											onClick={() => editSec(section)}
										>
											<i className='fas fa-edit' /> Edit
										</span>
										<span
											className='Delete-Btn'
											onClick={() =>
												deleteSec(section.id)
											}
										>
											<i className='fas fa-trash' />{' '}
											Delete
										</span>
									</div>
								</div>
								<p>{section.description}</p>
							</Fragment>
						)}
					</li>
				);
			} else {
				return null;
			}
		}
		return (
			<li className='Section-List-Item' key={section.id}>
				<h1>
					<Link
						onClick={() => {
							clearSection();
							setLoading();
						}}
						to={'/sections/s/' + section.id}
					>
						{section.title}
					</Link>
				</h1>
				<p>
					<NewLineToBr>{section.description}</NewLineToBr>
				</p>
			</li>
		);
	};

	return (
		<Fragment>
			{!loading && ownedByUser && isAuthenticated && (
				<div className='Head-Line'>Your Sections</div>
			)}
			<ul>
				{sections !== null && !loading ? (
					sections.map((section) => renderSection(section))
				) : (
					<Spinner />
				)}
			</ul>
		</Fragment>
	);
};

export default SectionsList;
