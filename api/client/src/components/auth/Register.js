import React, { useState, useContext, useEffect, Fragment } from 'react';
import AlertContext from '../../contexts/alert/alertContext';
import AuthContext from '../../contexts/auth/authContext';

const Register = (props) => {
	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);
	const { setAlert } = alertContext;
	const { register, error, clearErrors, isAuthenticated } = authContext;

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}
		if (error === 'User already exists') {
			setAlert(error, 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const [inputLabels, setInputLabels] = useState({
		name: false,
		email: false,
		password: false,
		password2: false,
	});

	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const { name, email, password, password2 } = user;
	const onChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
		setInputLabels({
			...inputLabels,
			[e.target.name]: e.target.value !== '',
		});
	};
	const onSubmit = (e) => {
		e.preventDefault();

		if (name === '' || email === '' || password === '') {
			setAlert('Please enter all fields', 'danger');
		} else if (password !== password2) {
			setAlert('Passwords do not match', 'danger');
		} else {
			register({
				name,
				email,
				password,
			});
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
			<h1>Account Register</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label
						htmlFor='name'
						className={inputLabels.name && 'field-active'}
					>
						<i className='fas fa-user' /> Full Name
					</label>
					<input
						type='text'
						name='name'
						value={name}
						onChange={onChange}
						onFocus={onFocus}
						onBlur={onBlur}
						required
					/>
				</div>
				<div className='form-group'>
					<label
						htmlFor='email'
						className={inputLabels.email && 'field-active'}
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
						className={inputLabels.password && 'field-active'}
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
						minLength='6'
					/>
				</div>
				<div className='form-group'>
					<label
						htmlFor='password2'
						className={inputLabels.password2 && 'field-active'}
					>
						<i className='fas fa-key' /> Confirm Password
					</label>
					<input
						type='password'
						name='password2'
						value={password2}
						onChange={onChange}
						onFocus={onFocus}
						onBlur={onBlur}
						required
						minLength='6'
					/>
				</div>
				<button type='submit' className='btn btn-primary btn-block'>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
