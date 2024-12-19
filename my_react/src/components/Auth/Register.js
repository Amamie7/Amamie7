import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const { login,} = useContext(AuthContext)

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
    address: '',
  });

  const { name, dateOfBirth, email, password, address } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch('http://127.0.0.1:7000/api/v1/user/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success
        console.log('Registration successful!');
        const data = await response.json();
        login(data)
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <div>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <div>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <div>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            minLength="8"
          />
          </div>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <div>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
