import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import SectionContext from '../../contexts/sections/sectionContext';
import Sections from '../sections/Sections';
import Section from '../sections/Section';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
const Home = () => {
	const authContext = useContext(AuthContext);
	const sectionContext = useContext(SectionContext);
	const { clearSection } = sectionContext;
	useEffect(() => {
		authContext.loadUser();
		// eslint-disable-next-line
	}, []);

	const [section, setSection] = useState({
		title: '',
		description: '',
	});

	const { title, description } = section;
	const onChange = (e) => {
		setSection({ ...section, [e.target.name]: e.target.value });
	};
	const onSubmit = (e) => {
		e.preventDefault();
	};
	return (
		<Router>
			<Route
				exact
				path='/sections'
				render={() => (
					<div className='grid-2'>
						<div>
							<h2>Featured Sections</h2>
							<Sections />
						</div>
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
									<label htmlFor='description'>
										Section Description
									</label>
									<input
										type='text'
										name='description'
										value={description}
										onChange={onChange}
										required
									/>
								</div>
								<button
									type='submit'
									className='btn btn-primary btn-block'
								>
									Create
								</button>
							</form>
						</div>
					</div>
				)}
			/>
			<Route
				path='/sections/s/:secID'
				render={({ match }) => <Section match={match} />}
			/>
		</Router>
	);
};
export default Home;
