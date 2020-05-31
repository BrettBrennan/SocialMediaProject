import React from 'react';
export default function NewLineToBr({ children = '' }) {
	return children.split('\n').reduce(function (arr, line) {
		return arr.concat(line, <br />);
	}, []);
}
