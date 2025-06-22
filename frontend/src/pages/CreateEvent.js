import React from 'react';
import EventForm from '../components/EventForm';
import { createEvent } from '../services/events';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createEvent(formData);
      navigate('/');
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event');
    }
  };

  return (
    <div>
      <h1 className="text-center my-4">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateEvent;