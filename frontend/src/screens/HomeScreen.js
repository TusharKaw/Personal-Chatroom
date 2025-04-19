import React from 'react';
import { Row, Col } from 'react-bootstrap';

const HomeScreen = () => {
  return (
    <>
      <h1>Welcome to MERN App</h1>
      <Row>
        <Col md={12}>
          <p>This is a MERN stack application boilerplate.</p>
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
