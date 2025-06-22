import React, { useState } from 'react';
import axios from 'axios';
import MatchScreen from './components/MatchScreen';
import Chat from './components/Chat';

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    empathy: '',
    openness: '',
    communication: ''
  });

  const [userId, setUserId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async e => {
  e.preventDefault();
  const empathy = Number(form.empathy);
  const openness = Number(form.openness);
  const communication = Number(form.communication);

  // Basic validation
  if (
    !form.name ||
    !form.email ||
    isNaN(empathy) ||
    isNaN(openness) ||
    isNaN(communication)
  ) {
    alert("Please enter all fields and ensure traits are numbers.");
    return;
  }
  try {
    const res = await axios.post('http://localhost:5000/api/register', {
      name: form.name,
      email: form.email,
      traits: {
        empathy: form.empathy,
        openness: form.openness,
        communication: form.communication
      }
    });
    alert('User Registered');
    setUserId(res.data.user._id);  // store the returned user ID
  } catch (err) {
    console.error('Registration failed:', err);
    alert('Something went wrong');
  }
};


return (
  <div style={{ padding: 20 }}>
    <h2>Register to Lone Town</h2>
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br />
      <input name="empathy" placeholder="Empathy (1-10)" onChange={handleChange} /><br />
      <input name="openness" placeholder="Openness (1-10)" onChange={handleChange} /><br />
      <input name="communication" placeholder="Communication (1-10)" onChange={handleChange} /><br />
      <button type="submit">Submit</button>
    </form>

    {userId && (
      <div style={{ marginTop: 40 }}>
        <MatchScreen userId={userId} />
        <Chat userId={userId} />
      </div>
      
    )}
  </div>
);
}

export default App;
