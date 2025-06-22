import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { getEvent, subscribeEvent, deleteEvent } from '../services/events';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
        setIsSubscribed(
          data.subscribers.some(sub => sub._id === currentUser?.id)
        );
      } catch (err) {
        console.error('Failed to fetch event', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchEvent();
  }, [id, currentUser]);

  const handleSubscribe = async () => {
    try {
      await subscribeEvent(id);
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error('Subscription failed', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Event not found</Alert>
      </Container>
    );
  }

  const isCreator = event.creator?._id === currentUser?.id;
  const canEdit = isCreator || currentUser?.role === 'admin';

  return (
    <Container className="py-4">
      {event.banner && (
        <Image 
          src={`http://localhost:5000/${event.banner}`} 
          fluid 
          className="mb-4 rounded"
        />
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{event.title}</h1>
        <div>
          {currentUser && (
            <Button 
              variant={isSubscribed ? 'outline-danger' : 'primary'}
              onClick={handleSubscribe}
              className="me-2"
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          )}
          {canEdit && (
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(`/edit-event/${event._id}`)}
              className="me-2"
            >
              Edit
            </Button>
          )}
          {canEdit && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-muted">
          <strong>Date:</strong> {new Date(event.date).toLocaleString()}
        </p>
        <p className="text-muted">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-muted">
          <strong>Created by:</strong> {event.creator?.username || 'Unknown'}
        </p>
        <p className="text-muted">
          <strong>Subscribers:</strong> {event.subscribers?.length || 0}
        </p>
      </div>
      
      <h4>Description</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{event.description}</p>
    </Container>
  );
};

export default EventDetail;