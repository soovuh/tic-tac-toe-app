# Online Tic-Tac-Toe Game

Welcome to the Online Tic-Tac-Toe Game! This project allows you to play the classic game of Tic-Tac-Toe online with other players. To get started, follow the instructions below:

## Getting Started

1. **Registration and Email Confirmation**

   - Visit the main page of the application.
   - To start playing, you need to register and confirm your email address.

2. **Login**

   - After successfully registering and confirming your email, log in to your account.

3. **Lobby**

   - Once logged in, you'll be directed to the lobby page.
   - Click the "Start search" button to start looking for an opponent.

4. **Gameplay**

   - When an opponent is found, you will be redirected to the game page, and the match will begin.
   - Players have a designated time limit of 20 seconds per move.
   - After the game, you will receive a notification indicating whether you won, lost, or the game ended in a draw.

5. **Password Reset**

   - If you forget your password, there is an option to reset it.

6. **Leaderboard**

   - Check out the leaderboard page to see the top players.
   - You can sort the leaderboard by various parameters, such as win rate, total games played, player name, and more.

7. **Find Me**
   - If you are logged in, you can use the "Find me" button to locate and scroll to your user entry on the leaderboard.

## Tech Stack

- **Backend**: Built with Django Rest Framework.
- **Frontend**: Developed using React library.
- **WebSocket Broker**: Utilizes Redis for handling WebSocket connections.

## Running the Project Locally

To run the project on your local machine, you have a couple of options:

1. **Separate Development Servers**:

   - Start the React frontend with `npm start`.
   - Start the Django backend with `python manage.py runserver`.

2. **Build and Combine**:
   - First, build the React application with `npm run build`.
   - Copy the generated `build` folder into the `game_api` directory.
   - Start the Django project with `python manage.py runserver`.

Ensure that you have a local or cloud Redis server connected for WebSocket functionality.

## Configuration

- In the `.env` file, provide your own configuration settings for email, database, and other necessary variables.

Enjoy playing Tic-Tac-Toe online with this project! If you encounter any issues or have suggestions for improvement, feel free to contribute or get in touch with the project maintainers. Have fun!
