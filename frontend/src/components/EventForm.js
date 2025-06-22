import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const EventForm = ({ event, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    banner: null
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location,
        banner: null
      });
    }
  }, [event]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      banner: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('location', formData.location);
    if (formData.banner) {
      data.append('banner', formData.banner);
    }
    
    onSubmit(data);
  };

  return (
    <Container className="py-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Banner Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {event?.banner && !formData.banner && (
            <div className="mt-2">
              <img 
                src={`http://localhost:5000/${event.banner}`} 
                alt="Current banner" 
                style={{ maxHeight: '200px' }} 
              />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </Form>
    </Container>
  );
};

export default EventForm;