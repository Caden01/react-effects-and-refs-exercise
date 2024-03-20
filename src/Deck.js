import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function getDeckFromAPI() {
    async function fetchData() {
      const res = await axios.get(`${API_BASE_URL}/new/shuffle`);
      setDeck(res.data);
    }
    fetchData();
  }, []);

  async function draw() {
    try {
      const res = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

      if (res.data.remaining === 0) throw new Error("Deck empty");

      const card = res.data.cards[0];

      setDrawn((d) => [
        ...d,
        {
          id: card.code,
          name: `${card.suit} ${card.value}`,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }

  async function shuffleCards() {
    setIsShuffling(true);
    try {
      await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
      setIsShuffling(false);
    } catch (err) {
      alert(err);
    }
  }

  function drawBtn() {
    return <button onClick={draw}>Draw</button>;
  }

  function shuffleBtn() {
    if (!deck) return null;
    return (
      <button onClick={shuffleCards} disabled={isShuffling}>
        Shuffle Deck
      </button>
    );
  }

  return (
    <div>
      {drawBtn()}
      {shuffleBtn()}

      <div>
        {drawn.map((c) => (
          <img alt={c.name} src={c.image} key={c.id} />
        ))}
      </div>
    </div>
  );
}

export default Deck;
