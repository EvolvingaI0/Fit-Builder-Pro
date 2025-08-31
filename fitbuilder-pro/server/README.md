# FitBuilder Pro - Backend Server

This is the Node.js (Express) backend server for the FitBuilder Pro application. It handles all secure operations, including communication with the AI API and admin-level database actions.

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- A Supabase project with the database schema set up (see `db_setup.sql`).
- An API key from an AI provider (e.g., Google AI Studio for a Gemini key).

### Server Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    Copy the example environment file to a new `.env` file:
    ```bash
    cp .env.example .env
    ```
    Now, open `.env` and fill in the required values:
    - `PORT`: The port the server will run on (e.g., 8080).
    - `SUPABASE_URL`: Your Supabase project URL.
    - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project's `service_role` key. **This is a secret and must not be shared.**
    - `GEMINI_API_KEY`: Your API key for the Gemini model.

4.  **Set up Supabase Database:**
    - Go to your Supabase project's SQL Editor.
    - Copy the contents of `db_setup.sql` and run it to create the necessary tables and policies.

### Running the Server

-   **Development Mode (with auto-reloading):**
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    First, build the TypeScript files:
    ```bash
    npm run build
    ```
    Then, start the server:
    ```bash
    npm start
    ```

The server will be running at `http://localhost:PORT`.

## API Endpoints

-   `POST /api/plan/generate`: Generates a personalized fitness and nutrition plan.
-   `POST /api/food/analyze`: Analyzes an uploaded image of a meal.
-   `GET /api/logs/meals`: Retrieves a paginated list of the user's meal logs.
