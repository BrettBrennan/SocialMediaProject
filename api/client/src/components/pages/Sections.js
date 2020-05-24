import React from 'react';
import { BrowserRouter as Route, Switch } from 'react-router-dom';

import SectionForm from '../sections/SectionForm';

import SectionsList from '../sections/SectionList';

const Sections = () => {
	return (
		<div className='grid-2'>
			<div>
				<h2>Featured Sections</h2>
				<SectionsList />
			</div>
			<SectionForm />
		</div>
	);
};
export default Sections;
