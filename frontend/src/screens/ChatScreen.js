import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChannelList from '../components/ChannelList';
import ChatArea from '../components/ChatArea';
import { initializeSocket, disconnectSocket } from '../utils/chatService';

const ChatScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    // Initialize socket connection
    initializeSocket();
    
    // Clean up socket on unmount
    return () => {
      disconnectSocket();
    };
  }, [userInfo, navigate]);
  
  if (!userInfo) {
    return null; // Will redirect to login
  }
  
  return (
    <Row className="h-100">
      {/* Channel List Column */}
      <Col md={3} className="border-end p-0">
        <div className="p-3">
          <ChannelList />
        </div>
      </Col>
      
      {/* Chat Area Column */}
      <Col md={9} className="p-0">
        <ChatArea />
      </Col>
    </Row>
  );
};

export default ChatScreen; 