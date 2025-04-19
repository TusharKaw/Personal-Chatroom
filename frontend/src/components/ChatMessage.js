import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, onDelete }) => {
  const { userInfo } = useSelector(state => state.auth);
  const isOwnMessage = userInfo && message.sender && userInfo._id === message.sender._id;
  
  const formattedTime = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : 'just now';
  
  return (
    <Card 
      className={`mb-2 border-0 ${isOwnMessage ? 'own-message' : ''}`}
      style={{ maxWidth: '80%', marginLeft: isOwnMessage ? 'auto' : '0' }}
    >
      <Card.Body className={`py-2 px-3 rounded ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'}`}>
        {!isOwnMessage && message.sender && (
          <div className="fw-bold">{message.sender.name}</div>
        )}
        <div className="message-content">{message.content}</div>
        <div className={`message-time small ${isOwnMessage ? 'text-white-50' : 'text-muted'}`}>
          {formattedTime}
          {isOwnMessage && (
            <Button 
              variant="link" 
              size="sm" 
              className={`p-0 ms-2 ${isOwnMessage ? 'text-white-50' : 'text-muted'}`}
              onClick={() => onDelete(message._id)}
            >
              <i className="fas fa-trash-alt"></i>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChatMessage; 