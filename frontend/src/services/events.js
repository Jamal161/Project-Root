import API from './api';

export const getEvents = async () => {
  const response = await API.get('/events');
  return response.data;
};

export const getEvent = async (id) => {
  const response = await API.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (formData) => {
  const response = await API.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateEvent = async (id, formData) => {
  const response = await API.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await API.delete(`/events/${id}`);
  return response.data;
};

export const subscribeEvent = async (id) => {
  const response = await API.post(`/events/${id}/subscribe`);
  return response.data;
};

export const searchEvents = async (query) => {
  const response = await API.get('/search', { params: { query } });
  return response.data;
};