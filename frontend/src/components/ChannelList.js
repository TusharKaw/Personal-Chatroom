import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { getChannels, createChannel, setCurrentChannel } from '../redux/slices/channelSlice';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannel, isLoading } = useSelector((state) => state.channel);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  useEffect(() => {
    dispatch(getChannels());
  }, [dispatch]);
  
  const handleSelectChannel = (channel) => {
    dispatch(setCurrentChannel(channel));
  };
  
  const handleCreateChannel = (e) => {
    e.preventDefault();
    dispatch(createChannel({
      name: newChannelName,
      description: newChannelDesc,
      isPrivate
    }));
    setShowModal(false);
    setNewChannelName('');
    setNewChannelDesc('');
    setIsPrivate(false);
  };
  
  return (
    <div className="channel-list mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Channels</h3>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> New
        </Button>
      </div>
      
      {isLoading ? (
        <p>Loading channels...</p>
      ) : (
        <ListGroup>
          {channels.length === 0 ? (
            <p className="text-muted">No channels available. Create one to get started!</p>
          ) : (
            channels.map(channel => (
              <ListGroup.Item 
                key={channel._id} 
                action
                active={currentChannel && currentChannel._id === channel._id}
                onClick={() => handleSelectChannel(channel)}
              >
                <div className="d-flex align-items-center">
                  {channel.isPrivate ? (
                    <i className="fas fa-lock me-2"></i>
                  ) : (
                    <i className="fas fa-hashtag me-2"></i>
                  )}
                  <div>
                    <div className="fw-bold">{channel.name}</div>
                    {channel.description && (
                      <small className="text-muted">{channel.description}</small>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      )}
      
      {/* Create Channel Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateChannel}>
            <Form.Group className="mb-3">
              <Form.Label>Channel Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="What's this channel about?"
                value={newChannelDesc}
                onChange={(e) => setNewChannelDesc(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Private channel"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <Form.Text className="text-muted">
                Private channels can only be viewed by its members
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={!newChannelName.trim()}
              >
                Create Channel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChannelList; 