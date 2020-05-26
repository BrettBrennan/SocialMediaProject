import React, { useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import SectionContext from '../../contexts/sections/sectionContext';
import Spinner from '../layout/Spinner';
const SectionsList = ({ ownedByUser }) => {
	const authContext = useContext(AuthContext);
	const sectionContext = useContext(SectionContext);
	const { isAuthenticated, user } = authContext;

	const {
		sections,
		getSections,
		getSectionsByUser,
		clearSection,
		setLoading,
		loading,
	} = sectionContext;

	useEffect(() => {
		setLoading();
		clearSection();
		console.log(ownedByUser);

		if (ownedByUser === true) {
			if (user === null) return null;
			if (user !== null) {
				console.log('Fetching sections by user: ' + user.id);
				getSectionsByUser(user.id);
			}
		} else {
			console.log('Fetching all sections');
			getSections();
		}
		// eslint-disable-next-line
	}, []);
	if (ownedByUser === true && user === null) return null;
	if (ownedByUser && !isAuthenticated) return <Fragment></Fragment>;
	if (sections !== null && sections.length === null && !loading) {
		return <h4>No sections exist yet! Try making one.</h4>;
	}
	const renderSection = (section) => {
		if (ownedByUser && isAuthenticated) {
			if (section.creator === user.id) {
				return (
					<li>
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
						<p>{section.description}</p>
					</li>
				);
			} else {
				return <Fragment></Fragment>;
			}
		}
		return (
			<li>
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
				<p>{section.description}</p>
			</li>
		);
	};

	return (
		<Fragment>
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
