import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import openingAudio from '../utils/opening.mp3';
import emojiAudio from '../utils/emoji.mp3';
import winAudio from '../utils/win.mp3';
import '../styles/Game.css';

const Game = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const maxWrongGuesses = 6;

  const openingRef = useRef(null);
  const emojiRef = useRef(null);
  const winRef = useRef(null);

  const audioStarted = useRef(false);

  const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

  const fetchRandomPokemon = async () => {
    setLoading(true);
    let success = false;
    while (!success) {
      try {
        const id = getRandomPokemonId();
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        success = true;
      } catch (error) {
        console.error('Failed to fetch, retrying...');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  useEffect(() => {
    const audio = openingRef.current;
    if (!audio) return;

    if (audioEnabled) {
      if (!audioStarted.current) {
        audio.currentTime = 0;
        audioStarted.current = true;
      }
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [audioEnabled]);

  useEffect(() => {
    if (!audioEnabled || !winRef.current) return;

    if (gameStatus === 'won') {
      winRef.current.currentTime = 0;
      winRef.current.play().catch(() => {});
    }
  }, [gameStatus, audioEnabled]);

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (pokemon.name.includes(letter)) {
      const uniqueLetters = [...new Set(pokemon.name.split(''))];
      const matched = uniqueLetters.filter(char =>
        [...guessedLetters, letter].includes(char)
      ).length;
      setCorrectGuesses(matched);
      if (matched === uniqueLetters.length) {
        setGameStatus('won');
      }
    } else {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    }

    if (audioEnabled && emojiRef.current) {
      emojiRef.current.currentTime = 0;
      emojiRef.current.play().catch(() => {});
    }
  };

  const resetGame = async () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setCorrectGuesses(0);
    setGameStatus('playing');
    setLoading(true);

    await fetchRandomPokemon();

    setLoading(false);
  };

  const displayPokemonName = () => {
    if (!pokemon) return '';
    return pokemon.name.split('').map((letter, index) =>
      guessedLetters.includes(letter) ?
        <span key={index} className="letter revealed">{letter}</span> :
        <span key={index} className="letter hidden">_</span>
    );
  };

  const alphabet = 'abcdefghijklmnopqrstuvwxyz-'.split('');
  const alphabetButtons = alphabet.map(letter => (
    <button
      key={letter}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
      className={`letter-btn ${guessedLetters.includes(letter) ?
        (pokemon && pokemon.name.includes(letter) ? 'correct' : 'incorrect') : ''}`}
    >
      {letter}
    </button>
  ));

  if (loading) return <div className="loading">Loading Pokémon...</div>;

  return (
    <>
      <audio ref={openingRef} src={openingAudio} preload="auto" />
      <audio ref={emojiRef} src={emojiAudio} preload="auto" />
      <audio ref={winRef} src={winAudio} preload="auto" />

      <div className="game-container">
        <h1>Who's That Pokémon?</h1>

        <div className="pokemon-container">
          {pokemon && (
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt="Pokemon silhouette"
              className={`pokemon-image ${gameStatus !== 'won' ? 'silhouette' : ''}`}
              style={{
                filter: gameStatus === 'won' ? 'none' :
                  `brightness(${correctGuesses > 0 ? correctGuesses * 0.15 : 0})`
              }}
            />
          )}
        </div>

        <div className="sound-toggle-container">
          <button className="sound-toggle-btn" onClick={toggleAudio}>
            {audioEnabled ? 'Mute' : 'Sound'}
          </button>
        </div>

        <div className="pokemon-name">{displayPokemonName()}</div>

        <div className="game-status">
          {gameStatus === 'won' && <div className="win-message">You won! It's {pokemon.name}!</div>}
          {gameStatus === 'lost' && <div className="lose-message">You lost! It was {pokemon.name}!</div>}
          <div className="wrong-guesses">Wrong guesses: {wrongGuesses}/{maxWrongGuesses}</div>
        </div>

        <div className="letter-buttons">{alphabetButtons}</div>

        {gameStatus !== 'playing' && (
          <button className="reset-btn" onClick={resetGame}>Play Again</button>
        )}
      </div>
    </>
  );
};

export default Game;
