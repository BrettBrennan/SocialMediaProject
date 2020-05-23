import React, { useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SectionContext from '../../contexts/sections/sectionContext';
import Spinner from '../layout/Spinner';
const Sections = () => {
	const sectionContext = useContext(SectionContext);
	const {
		sections,
		getSections,
		clearSection,
		setLoading,
		loading,
	} = sectionContext;

	useEffect(() => {
		setLoading();
		clearSection();
		getSections();
		// eslint-disable-next-line
	}, []);

	if (sections !== null && sections.length === null && !loading) {
		return <h4>No sections exist yet! Try making one.</h4>;
	}

	return (
		<Fragment>
			<ul>
				{sections !== null && !loading ? (
					sections.map((section) => (
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
					))
				) : (
					<Spinner />
				)}
			</ul>
		</Fragment>
	);
};

export default Sections;
