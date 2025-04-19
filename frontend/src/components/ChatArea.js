import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import ChatMessage from './ChatMessage';
import { getChannelMessages, createMessage, deleteMessage, resetMessages, addMessage } from '../redux/slices/messageSlice';
import { joinChannel, leaveChannel } from '../redux/slices/channelSlice';
import { 
  joinChannel as socketJoinChannel, 
  leaveChannel as socketLeaveChannel, 
  sendMessage, 
  subscribeToMessages, 
  unsubscribeFromMessages 
} from '../utils/chatService';

const ChatArea = () => {
  const dispatch = useDispatch();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const { currentChannel } = useSelector((state) => state.channel);
  const { messages, isLoading, isError, errorMessage } = useSelector((state) => state.message);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Subscribe to messages for the current channel
  useEffect(() => {
    if (currentChannel) {
      // Get messages for the channel
      dispatch(getChannelMessages({ channelId: currentChannel._id }));
      
      // Join the channel socket
      socketJoinChannel(currentChannel._id);
      
      // Subscribe to new messages
      subscribeToMessages((message) => {
        if (message.channelId === currentChannel._id) {
          dispatch(addMessage(message));
        }
      });
    }
    
    return () => {
      // Clean up
      if (currentChannel) {
        socketLeaveChannel(currentChannel._id);
        unsubscribeFromMessages();
      }
      dispatch(resetMessages());
    };
  }, [dispatch, currentChannel]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageInput.trim() && currentChannel) {
      // Send message to backend
      dispatch(createMessage({
        content: messageInput,
        channelId: currentChannel._id,
      }));
      
      // Send through socket for real-time updates
      sendMessage({
        content: messageInput,
        channelId: currentChannel._id,
        sender: {
          _id: userInfo._id,
          name: userInfo.name,
          email: userInfo.email,
        },
        createdAt: new Date().toISOString(),
      });
      
      // Clear input
      setMessageInput('');
    }
  };
  
  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(messageId));
  };
  
  const handleJoinChannel = () => {
    if (currentChannel) {
      dispatch(joinChannel(currentChannel._id));
    }
  };
  
  return (
    <div className="chat-area d-flex flex-column h-100">
      {currentChannel ? (
        <>
          <div className="chat-header border-bottom p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4>
                {currentChannel.isPrivate ? (
                  <i className="fas fa-lock me-2"></i>
                ) : (
                  <i className="fas fa-hashtag me-2"></i>
                )}
                {currentChannel.name}
              </h4>
              {!currentChannel.members?.includes(userInfo._id) && !currentChannel.isPrivate && (
                <Button variant="outline-primary" size="sm" onClick={handleJoinChannel}>
                  Join Channel
                </Button>
              )}
            </div>
            {currentChannel.description && (
              <div className="text-muted">{currentChannel.description}</div>
            )}
          </div>
          
          <div 
            className="chat-messages flex-grow-1 overflow-auto p-3"
            style={{ height: 0 }} // This makes flex-grow work with overflow
            ref={chatContainerRef}
          >
            {isError && (
              <Alert variant="danger">{errorMessage}</Alert>
            )}
            
            {isLoading && messages.length === 0 ? (
              <div className="text-center">
                <i className="fas fa-spinner fa-spin"></i> Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted my-5">
                <i className="fas fa-comments fa-3x mb-3"></i>
                <p>No messages yet. Be the first to send a message!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message._id}
                    message={message}
                    onDelete={handleDeleteMessage}
                  />
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input p-3 border-top">
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={!currentChannel.members?.includes(userInfo._id)}
                />
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={!messageInput.trim() || !currentChannel.members?.includes(userInfo._id)}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </InputGroup>
              {!currentChannel.members?.includes(userInfo._id) && (
                <div className="text-muted mt-2 small">
                  You need to join this channel to send messages.
                </div>
              )}
            </Form>
          </div>
        </>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
          <i className="fas fa-comments fa-5x mb-4"></i>
          <h3>Select a channel to start chatting</h3>
          <p>Or create a new channel to get started</p>
        </div>
      )}
    </div>
  );
};

export default ChatArea; 