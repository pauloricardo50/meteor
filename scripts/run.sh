#!/bin/bash

# This script starts all microservices and points them to the same mongoDB instance

echo Running e-Potek...

# Check if tmux is installed
if ! type "tmux" > /dev/null; then
  #if not tell user
  echo You need to install tmux (brew: brew install tmux, apt: apt-get install tmux)
fi

# Start tmux session
SESSION="e-potek"
if [[ "$TERM" =~ "screen".* ]]; then
  #Already in tmux, so create a new window
  tmux new-window -n $SESSION
else
  #Not in tmux, create a new session
  tmux new-session -d -s $SESSION 
fi
tmux splitw -t 0 -h -p 50
tmux splitw -t 0 -v -p 50
tmux splitw -t 2 -v -p 50

# Start each app in its own pane
tmux select-pane -t 0
tmux send-keys "cd ../microservices/www; meteor npm start" C-m
tmux select-pane -t 1
tmux send-keys "cd ../microservices/app; export MONGO_URL=mongodb://localhost:3001/meteor; meteor npm start" C-m
tmux select-pane -t 2
tmux send-keys "cd ../microservices/admin; export MONGO_URL=mongodb://localhost:3001/meteor; meteor npm start" C-m

#Prepare 'meteor mongo' command for user in 4th pane with focus on it
tmux select-pane -t 3
tmux send-keys "cd ../microservices/www; meteor mongo" 

tmux attach-session -t $SESSION