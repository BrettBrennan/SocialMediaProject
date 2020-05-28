import React from 'react';

import SectionForm from '../sections/SectionForm';

import SectionsList from '../sections/SectionList';

const Sections = () => {
	return (
		<div className='grid-2'>
			<div>
				<div className='Head-Line'>Featured Sections</div>
				<SectionsList ownedByUser={false} />
			</div>
			<div>
				<SectionForm />
				<SectionsList ownedByUser={true} />
			</div>
		</div>
	);
};
export default Sections;
