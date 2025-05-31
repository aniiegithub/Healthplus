# Healthplus Backend

This folder contains the backend API for the Healthplus application, built with Node.js and Express.

## Features

- RESTful API endpoints for managing candidates and reports
- MongoDB integration for data persistence
- Utility functions for generating candidate reports
- Handles image uploads and processing
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js (v14 or above recommended)
- MongoDB (local or cloud instance)
- npm (comes with Node.js)

### Installation

1. Clone the repo (if you haven’t already):

   ```bash
   git clone https://github.com/aniiegithub/Healthplus.git
   cd Healthplus/healthplus/backend
Install dependencies:
npm install
Set up environment variables:

Create a .env file in the backend folder and add necessary variables, for example:

PORT=5000
MONGO_URI= mongodb://localhost:27017/healthplus
BASE_URL=http://localhost:5000

Start The server
node server.js
The backend server will run on http://localhost:5000 (or your specified PORT).

Usage
Use Postman or any API client to test the endpoints.

API routes are defined in the routes folder.

Candidate reports can be generated and downloaded.

Contributing
Feel free to open issues or pull requests to improve the backend!
