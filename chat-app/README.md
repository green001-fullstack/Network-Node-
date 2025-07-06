# Node.js TCP Chat Application

A real-time terminal-based chat application using Node.js' native `net` module for TCP communication.

## Features

- Real-time messaging between multiple clients
- Automatic user ID assignment
- Local network communication
- Clean terminal interface with dynamic updates
- Join/leave notifications

## Prerequisites

- Node.js 18+
- Terminal with ANSI escape code support (most modern terminals)

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/node-tcp-chat.git
   cd node-tcp-chat
2. No dependencies needed! (Uses native Node.js modules)
   
## Usage

Starting the Server : node server.js
Connecting Clients : node client.js

## Key Components

Server: Manages connections and message broadcasting
Client: Handles user input and displays messages
Protocol:
id-{number} - Server-assigned client ID
{id}-message-{content} - Message format

## Known Limitations

Local network only (for security)
