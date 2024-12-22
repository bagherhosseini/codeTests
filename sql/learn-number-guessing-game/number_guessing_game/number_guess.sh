#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# Generate random number between 1 and 1000
SECRET_NUMBER=$(( RANDOM % 1000 + 1 ))

# Get username
echo "Enter your username:"
read USERNAME

# Check username length
if [[ ${#USERNAME} -gt 22 ]]
then
  echo "Username must be 22 characters or less"
  exit 1
fi

# Query database for user
USER_INFO=$($PSQL "SELECT games_played, best_game FROM users WHERE username='$USERNAME'")

# If user exists
if [[ -n $USER_INFO ]]
then
  # Parse user info
  GAMES_PLAYED=$(echo $USER_INFO | cut -d'|' -f1)
  BEST_GAME=$(echo $USER_INFO | cut -d'|' -f2)
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
else
  # Add new user
  INSERT_USER=$($PSQL "INSERT INTO users(username, games_played, best_game) VALUES('$USERNAME', 0, 0)")
  echo "Welcome, $USERNAME! It looks like this is your first time here."
fi

# Initialize guess count
GUESS_COUNT=0

# Game loop
echo "Guess the secret number between 1 and 1000:"
while true; do
  read GUESS
  
  # Validate input is an integer
  if [[ ! $GUESS =~ ^[0-9]+$ ]]
  then
    echo "That is not an integer, guess again:"
    continue
  fi

  # Increment guess count
  ((GUESS_COUNT++))

  # Check guess
  if [[ $GUESS -eq $SECRET_NUMBER ]]
  then
    echo "You guessed it in $GUESS_COUNT tries. The secret number was $SECRET_NUMBER. Nice job!"
    
    # Update user stats
    if [[ -n $USER_INFO ]]
    then
      NEW_GAMES=$((GAMES_PLAYED + 1))
      if [[ $GUESS_COUNT -lt $BEST_GAME || $BEST_GAME -eq 0 ]]
      then
        UPDATE_STATS=$($PSQL "UPDATE users SET games_played=$NEW_GAMES, best_game=$GUESS_COUNT WHERE username='$USERNAME'")
      else
        UPDATE_STATS=$($PSQL "UPDATE users SET games_played=$NEW_GAMES WHERE username='$USERNAME'")
      fi
    else
      UPDATE_STATS=$($PSQL "UPDATE users SET games_played=1, best_game=$GUESS_COUNT WHERE username='$USERNAME'")
    fi
    break
  elif [[ $GUESS -gt $SECRET_NUMBER ]]
  then
    echo "It's lower than that, guess again:"
  else
    echo "It's higher than that, guess again:"
  fi
done