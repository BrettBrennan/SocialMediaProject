import React, { useContext, useEffect, Fragment } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useHistory,
} from 'react-router-dom';

import AuthContext from '../../contexts/auth/authContext';
import SectionContext from '../../contexts/sections/sectionContext';
import Spinner from '../layout/Spinner';
const Section = ({ match }) => {
	const sectionContext = useContext(SectionContext);
	const {
		section,
		clearSection,
		getSection,
		setLoading,
		loading,
		error,
	} = sectionContext;

	const { secID } = match.params;

	useEffect(() => {
		clearSection();
		setLoading();

		// eslint-disable-next-line
	}, []);
	const { history } = useHistory();
	if (secID !== '') getSection(secID);

	if (error) {
		return <h1>error</h1>;
	}

	if ((section === null || section.length === null) && !loading) {
		return <h1>This section doesn't exist yet! Try making one.</h1>;
	}

	if (loading) {
		return (
			<Fragment>
				<Spinner />
			</Fragment>
		);
	}

	return (
		<div>
			<h1>{section.title}</h1>
			<h2>{section.description}</h2>
		</div>
	);
};

export default Section;
