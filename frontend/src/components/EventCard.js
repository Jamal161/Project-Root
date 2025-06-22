import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  return (
    <Card className="mb-4 h-100">
      {event.banner && (
        <Card.Img 
          variant="top" 
          src={`http://localhost:5000/${event.banner}`} 
          alt={event.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{event.title}</Card.Title>
        <Card.Text className="text-muted">
          {format(new Date(event.date), 'MMMM d, yyyy h:mm a')}
        </Card.Text>
        <Card.Text>{event.location}</Card.Text>
        <Card.Text className="flex-grow-1">
          {event.description.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description}
        </Card.Text>
        <Button as={Link} to={`/event/${event._id}`} variant="primary">
          View Details
        </Button>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          Created by: {event.creator?.username || 'Unknown'}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default EventCard;