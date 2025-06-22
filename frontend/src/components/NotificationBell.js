import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { getNotifications, checkUpdates, markAsRead } from '../services/notifications';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleCheckUpdates = async () => {
    try {
      const updates = await checkUpdates();
      setNotifications([...updates, ...notifications]);
      setUnreadCount(unreadCount + updates.length);
    } catch (err) {
      console.error('Failed to check updates', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(unreadCount - 1);
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <Dropdown className="me-3">
      <Dropdown.Toggle variant="dark" id="dropdown-notifications">
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" style={{ minWidth: '300px' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="m-0">Notifications</h6>
          <Button variant="outline-primary" size="sm" onClick={handleCheckUpdates}>
            Check Updates
          </Button>
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Dropdown.ItemText>No notifications</Dropdown.ItemText>
          ) : (
            notifications.map(notification => (
              <Dropdown.Item 
                key={notification._id} 
                className={`d-flex justify-content-between ${!notification.read ? 'fw-bold' : ''}`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <div>{notification.message}</div>
                {!notification.read && (
                  <span className="badge bg-primary">New</span>
                )}
              </Dropdown.Item>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;