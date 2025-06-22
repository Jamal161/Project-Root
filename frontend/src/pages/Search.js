import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Spinner, InputGroup, Container, Button } from 'react-bootstrap';
import EventCard from '../components/EventCard';
import { searchEvents } from '../services/events';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() !== '') {
      setLoading(true);
      const timer = setTimeout(() => {
        fetchResults();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const data = await searchEvents(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Search Events</h1>
      
      <Form className="mb-4">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Search events by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="outline-secondary">
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>
      </Form>
      
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      )}
      
      {!loading && query && results.length === 0 && (
        <p className="text-center py-4">No events found matching your search</p>
      )}
      
      {results.length > 0 && (
        <>
          <h5 className="mb-3">Search Results</h5>
          <Row xs={1} md={2} lg={3} className="g-4">
            {results.map(event => (
              <Col key={event._id}>
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Search;