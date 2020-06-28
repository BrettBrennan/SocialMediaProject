import React, { Fragment } from 'react';
export default function NewLineToBr({ children = '' }) {
	return children.split('\n').map((text, index) => (
		<Fragment key={`${text}-${index}`}>
			{text}
			<br />
		</Fragment>
	));
}
