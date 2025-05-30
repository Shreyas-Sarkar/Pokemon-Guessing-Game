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
  const [audioStarted, setAudioStarted] = useState(false);
  const maxWrongGuesses = 6;

  const openingRef = useRef(null);
  const emojiRef = useRef(null);
  const winRef = useRef(null);

  const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

  const fetchRandomPokemon = async () => {
    try {
      setLoading(true);
      const id = getRandomPokemonId();
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon(response.data);
      setLoading(false);
    } catch (error) {
      fetchRandomPokemon();
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  useEffect(() => {
    if (audioStarted && openingRef.current) {
      openingRef.current.loop = true;
      openingRef.current.volume = 0.5;
      openingRef.current.play().catch(() => {});
    }
    return () => {
      if (openingRef.current) {
        openingRef.current.pause();
        openingRef.current.currentTime = 0;
      }
    };
  }, [audioStarted]);

  useEffect(() => {
    if (!audioStarted) return;
    if (gameStatus === 'won' && winRef.current) {
      openingRef.current && openingRef.current.pause();
      winRef.current.currentTime = 0;
      winRef.current.play().catch(() => {});
    }
    if (gameStatus === 'playing' && openingRef.current) {
      openingRef.current.play().catch(() => {});
    }
  }, [gameStatus, audioStarted]);

  const handleUserInteraction = () => {
    if (!audioStarted) setAudioStarted(true);
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing') return;
    if (guessedLetters.includes(letter)) return;
    if (emojiRef.current) {
      emojiRef.current.currentTime = 0;
      emojiRef.current.play().catch(() => {});
    }
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    if (!pokemon.name.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    } else {
      const pokemonNameLetters = [...new Set(pokemon.name.split(''))];
      const newCorrectGuesses = pokemonNameLetters.filter(char => 
        newGuessedLetters.includes(char)
      ).length;
      setCorrectGuesses(newCorrectGuesses);
      if (newCorrectGuesses === pokemonNameLetters.length) {
        setGameStatus('won');
      }
    }
  };

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setCorrectGuesses(0);
    setGameStatus('playing');
    fetchRandomPokemon();
    if (openingRef.current && audioStarted) {
      openingRef.current.currentTime = 0;
      openingRef.current.play().catch(() => {});
    }
    if (winRef.current) {
      winRef.current.pause();
      winRef.current.currentTime = 0;
    }
  };

  const displayPokemonName = () => {
    if (!pokemon) return '';
    return pokemon.name.split('').map((letter, index) => {
      return guessedLetters.includes(letter) ? 
        <span key={index} className="letter revealed">{letter}</span> : 
        <span key={index} className="letter hidden">_</span>;
    });
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

  if (loading) {
    return <div className="loading">Loading Pokemon...</div>;
  }

  return (
    <div className="game-container" onClick={handleUserInteraction} tabIndex={0}>
      <audio ref={openingRef} src={openingAudio} />
      <audio ref={emojiRef} src={emojiAudio} />
      <audio ref={winRef} src={winAudio} />
      <h1>Who's That Pokemon?</h1>
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
      <div className="pokemon-name">
        {displayPokemonName()}
      </div>
      <div className="game-status">
        {gameStatus === 'won' && <div className="win-message">You won! It's {pokemon.name}!</div>}
        {gameStatus === 'lost' && <div className="lose-message">You lost! It was {pokemon.name}!</div>}
        <div className="wrong-guesses">Wrong guesses: {wrongGuesses}/{maxWrongGuesses}</div>
      </div>
      <div className="letter-buttons">
        {alphabetButtons}
      </div>
      {gameStatus !== 'playing' && (
        <button className="reset-btn" onClick={resetGame}>Play Again</button>
      )}
    </div>
  );
};

export default Game;