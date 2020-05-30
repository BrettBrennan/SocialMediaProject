import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../contexts/alert/alertContext';
import AuthContext from '../../contexts/auth/authContext';

const Login = (props) => {
	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);
	const { setAlert } = alertContext;
	const { login, error, clearErrors, isAuthenticated } = authContext;

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}
		if (error === 'Invalid Credentials') {
			setAlert(error, 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const [user, setUser] = useState({
		email: '',
		password: '',
	});
	const [inputLabels, setInputLabels] = useState({
		email: false,
		password: false,
	});
	const { email, password } = user;
	const onChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
		setInputLabels({
			...inputLabels,
			[e.target.name]: e.target.value !== '',
		});
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (email === '' || password === '') {
			setAlert('Please fill in all fields', 'danger');
		} else {
			login({ email, password });
		}
	};
	const onFocus = (e) => {
		//alert('Test Focus');
		setInputLabels({
			...inputLabels,
			[e.target.name]: true,
		});
	};
	const onBlur = (e) => {
		//alert('Test Blur');
		setInputLabels({
			...inputLabels,
			[e.target.name]: e.target.value === '' ? false : true,
		});
	};
	return (
		<div className='form-container'>
			<h1>Account Login</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label
						htmlFor='email'
						className={
							inputLabels.email !== '' ? 'field-active' : ''
						}
					>
						<i className='fas fa-envelope' /> Email
					</label>
					<input
						type='email'
						name='email'
						value={email}
						onChange={onChange}
						onFocus={onFocus}
						onBlur={onBlur}
						required
					/>
				</div>
				<div className='form-group'>
					<label
						htmlFor='password'
						className={
							inputLabels.password !== '' ? 'field-active' : ''
						}
					>
						<i className='fas fa-key' /> Password
					</label>
					<input
						type='password'
						name='password'
						value={password}
						onChange={onChange}
						onFocus={onFocus}
						onBlur={onBlur}
						required
					/>
				</div>
				<button type='submit' className='btn btn-primary btn-block'>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
