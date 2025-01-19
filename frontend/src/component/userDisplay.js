import React, { useState, useEffect } from 'react';
import './UserDisplay.css'; // Importing the CSS for styling

const UserDisplay = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://socialmedia-fbyd.onrender.com/socialMedia/getAllUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure token is sent
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Users:', data); // Debugging fetched users
        if (Array.isArray(data.allUser) && data.allUser.length > 0) {
          // Initialize `imageIndex` for each user if not already set
          const updatedUsers = data.allUser.map(user => ({
            ...user,
            imageIndex: user.imageIndex || 0, // Default imageIndex to 0
          }));
          setUsers(updatedUsers);
        } else {
          console.error('No users found or data is not in array format.');
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleImageSlide = (userId, direction) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user._id === userId) {
          const newImageIndex =
            direction === 'next'
              ? (user.imageIndex + 1) % user.imageUrl.length
              : (user.imageIndex - 1 + user.imageUrl.length) % user.imageUrl.length;
          return { ...user, imageIndex: newImageIndex };
        }
        return user;
      })
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Users List</h1>
      <div className="user-list">
        {Array.isArray(users) && users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="user-card">
              <h2>{user.name}</h2>
              <p>
                Social Media Handle:{' '}
                <a
                  href={`${user.socialMediaHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  {user.socialMediaHandle}
                </a>
              </p>
              <div className="user-photos">
                <div className="carousel-container">
                  {Array.isArray(user.imageUrl) && user.imageUrl.length > 0 ? (
                    <>
                      <img
                        src={user.imageUrl[user.imageIndex || 0]}
                        alt={`User ${user.name} Photo`}
                        className="carousel-image active"
                      />
                      <div className="carousel-controls">
                        <button
                          className="prev-button"
                          onClick={() => handleImageSlide(user._id, 'prev')}
                        >
                          ←
                        </button>
                        <button
                          className="next-button"
                          onClick={() => handleImageSlide(user._id, 'next')}
                        >
                          →
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserDisplay;
