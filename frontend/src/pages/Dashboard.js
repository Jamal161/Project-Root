import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/events';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Upcoming Events</h1>
        {currentUser && (
          <a href="/create-event" className="btn btn-primary">
            Create New Event
          </a>
        )}
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-5">
          <h4>No events found</h4>
          <p>Create the first event!</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {events.map(event => (
            <Col key={event._id}>
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;