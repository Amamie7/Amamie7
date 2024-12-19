import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const SavedUser = JSON.parse(localStorage.getItem('user'));
        console.log('SavedUser', SavedUser)

        let URL = `http://127.0.0.1:7000/api/v1/user/${SavedUser._id}`
        console.log('URL', URL)
        const response = await fetch(URL, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-info">
          <div className="info-item">
            <strong>Name:</strong> <span>{user.name}</span>
          </div>
          <div className="info-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="info-item">
            <strong>Role:</strong> <span>{user.role}</span>
          </div>
          <div className="info-item">
            <strong>Date of Birth:</strong> <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <strong>Address:</strong> <span>{user.address}</span>
          </div>
          <div className="info-item">
            <strong>City:</strong> <span>{user.city}</span>
          </div>
          <div className="info-item">
            <strong>Verified Email:</strong> <span>{user.verifiedEmail ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;
