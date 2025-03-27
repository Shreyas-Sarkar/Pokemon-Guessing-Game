import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Game.css';

const Game = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const maxWrongGuesses = 6;

  // Generate a random Pokemon ID (1-898 for all Pokemon up to Gen 8)
  const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

  // Fetch a random Pokemon
  const fetchRandomPokemon = async () => {
    try {
      setLoading(true);
      const id = getRandomPokemonId();
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      // Try again if there's an error
      fetchRandomPokemon();
    }
  };

  // Initialize the game
  useEffect(() => {
    fetchRandomPokemon();
    // Play game start sound when component mounts
  }, []);

  // Handle letter guess
  const handleGuess = (letter) => {
    if (gameStatus !== 'playing') return;
    
    // If letter was already guessed, do nothing
    if (guessedLetters.includes(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    // Check if the guessed letter is in the Pokemon name
    if (!pokemon.name.includes(letter)) {
      // Play incorrect sound
      
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      // Check if player lost
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    } else {
      // Count unique correct letters guessed
      const pokemonNameLetters = [...new Set(pokemon.name.split(''))];
      const newCorrectGuesses = pokemonNameLetters.filter(char => 
        newGuessedLetters.includes(char)
      ).length;
      
      setCorrectGuesses(newCorrectGuesses);
      
      // Play correct sound
      
      // Check if player won (all letters in the name have been guessed)
      if (newCorrectGuesses === pokemonNameLetters.length) {
        setGameStatus('won');
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setCorrectGuesses(0);
    setGameStatus('playing');
    fetchRandomPokemon();
  };

  // Display the Pokemon name with underscores for unguessed letters
  const displayPokemonName = () => {
    if (!pokemon) return '';
    
    return pokemon.name.split('').map((letter, index) => {
      return guessedLetters.includes(letter) ? 
        <span key={index} className="letter revealed">{letter}</span> : 
        <span key={index} className="letter hidden">_</span>;
    });
  };

  // Generate alphabet buttons
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
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
    <div className="game-container">
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