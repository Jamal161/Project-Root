import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { getEvent, updateEvent } from '../services/events';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateEvent(id, formData);
      navigate(`/event/${id}`);
    } catch (err) {
      console.error('Failed to update event', err);
      alert('Failed to update event');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center py-5">Event not found</div>;
  }

  return (
    <div>
      <h1 className="text-center my-4">Edit Event</h1>
      <EventForm event={event} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditEvent;