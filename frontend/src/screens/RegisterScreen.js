import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { register } from '../redux/slices/authSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  const redirect = location.search ? location.search.split('=')[1] : '/chat';

  useEffect(() => {
    // Debug log
    console.log('RegisterScreen useEffect - userInfo:', userInfo);
    
    if (userInfo) {
      console.log('Redirecting to:', redirect);
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      console.log('Attempting registration with:', { name, email });
      setMessage(null);
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Alert variant="danger">{message}</Alert>}
      {isError && <Alert variant="danger">{errorMessage || 'Registration failed. Please try again.'}</Alert>}
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' disabled={isLoading} className='my-3'>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen; 