import React from 'react';

import SectionForm from '../sections/SectionForm';

import SectionsList from '../sections/SectionList';

const Sections = () => {
	return (
		<div className='grid-2'>
			<div className='col-md'>
				<div className='Head-Line'>Featured Sections</div>
				<SectionsList ownedByUser={false} subscribeFilter={false} />
			</div>
			<div className='col-md'>
				<SectionForm />
				<br />
				<SectionsList ownedByUser={true} subscribeFilter={false} />
			</div>
		</div>
	);
};
export default Sections;
