import React from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <div className="text-center mb-5 p-4 bg-light rounded">
        <h1>Welcome to Tushar's Chatroom</h1>
        <p className="lead">
          A real-time messaging platform where you can create channels and chat with others
        </p>
        
        {userInfo ? (
          <LinkContainer to="/chat">
            <Button variant="primary" size="lg" className="mt-3">
              Go to Chat <i className="fas fa-arrow-right"></i>
            </Button>
          </LinkContainer>
        ) : (
          <div className="d-flex justify-content-center gap-3 mt-3">
            <LinkContainer to="/login">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </LinkContainer>
            <LinkContainer to="/register">
              <Button variant="outline-primary" size="lg">
                Register
              </Button>
            </LinkContainer>
          </div>
        )}
      </div>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="fas fa-comments fa-3x text-primary"></i>
              </div>
              <Card.Title className="text-center">Real-time Chat</Card.Title>
              <Card.Text>
                Enjoy seamless, real-time messaging with other users. Messages appear instantly without refreshing.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="fas fa-users fa-3x text-success"></i>
              </div>
              <Card.Title className="text-center">Multiple Channels</Card.Title>
              <Card.Text>
                Create and join different channels based on topics or groups. Keep your conversations organized.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <i className="fas fa-lock fa-3x text-warning"></i>
              </div>
              <Card.Title className="text-center">Private Channels</Card.Title>
              <Card.Text>
                Create private channels for sensitive discussions. Control who can access your conversations.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
