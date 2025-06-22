import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

function MatchScreen({ userId }) {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await axios.get(`http://localhost:5000/api/match/${userId}`);
        setMatch(res.data);
      } catch (err) {
        console.error('No match found or error occurred');
      }
    }
    fetchMatch();
  }, [userId]);

  if (!match) return <p>Looking for your perfect match...</p>;

  return (
    <div>
      <h2>🎯 Your Daily Match</h2>
      <p><strong>You:</strong> {match.yourName}</p>
      <p><strong>Matched With:</strong> {match.matchName}</p>
      <p><strong>Email:</strong> {match.matchEmail}</p>
      <ChatBox userId={userId} matchId={match.matchId} />
    </div>
  );
}

export default MatchScreen;
