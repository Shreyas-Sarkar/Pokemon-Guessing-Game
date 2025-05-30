# Who's That Pokemon? - A Pokemon Guessing Game

## Overview
Who's That Pokemon? is an interactive guessing game inspired by the popular segment from the Pokemon anime series. Players are presented with a silhouette of a Pokemon and must guess its name letter by letter, similar to Hangman. As correct letters are guessed, the Pokemon's image gradually becomes clearer, making it easier to identify.

## Game Features
- **Pokemon Silhouettes**: Each round features a randomly selected Pokemon from generations 1-8 (up to #898)
- **Progressive Reveal**: The Pokemon image becomes clearer with each correct letter guessed
- **Letter Guessing**: Interactive alphabet buttons for making guesses
- **Limited Attempts**: Players have 6 wrong guesses before losing the round
- **Win/Lose States**: Clear feedback when the player wins or loses, with the option to play again

## Technologies Used
- **React**: Frontend UI library for building the interactive game interface
- **Vite**: Fast build tool and development server
- **Axios**: For making API requests to the PokeAPI
- **PokeAPI**: Public API providing Pokemon data and images
- **CSS Animations**: For visual effects and transitions

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Running the Game
1. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
2. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173/)

### Building for Production
```
npm run build
```
or
```
yarn build
```

## How to Play
1. A random Pokemon will appear as a silhouette
2. Click on letter buttons to guess letters in the Pokemon's name
3. Correct guesses reveal the letter in the name and make the image clearer
4. Incorrect guesses count toward your 6 allowed mistakes
5. Win by guessing all letters in the Pokemon's name before making 6 mistakes
6. After winning or losing, click "Play Again" to start a new round

## Future Enhancements
- Sound effects for correct/incorrect guesses
- Difficulty levels (different generations or types of Pokemon)
- Score tracking and leaderboards
- Hint system

## License
This project is open source and available under the MIT License.
