# CivicSync Frontend

This is the user interface for the CivicSync application, allowing users to interact with the CivicSync backend API to report, view, and manage community issues.

Built with React, TypeScript, Vite, Tailwind CSS, and React Leaflet.

## Features

*   **User Authentication:** Login, Registration, Logout integration with the backend API.
*   **Issue Reporting:** Form to submit new issues, including title, description, category, image URL (optional), and location selection via an interactive map.
*   **Issue Viewing:**
    *   **List View:** Paginated list of community issues with filtering options (category, status).
    *   **Map View:** Displays issues geographically on a map with status-specific markers and popups.
    *   **Detailed View:** Shows full details of a single issue, including description, metadata, image, map location, and vote count.
*   **Issue Management:**
    *   **My Issues Page:** Lists issues created by the logged-in user.
    *   **Editing:** Allows creators to edit their *Pending* issues.
    *   **Deleting:** Allows creators to delete their *Pending* issues.
    *   **Status Updates:** Displays the current status; allows issue creators to update status from *Pending* to *In Progress* or *Resolved* (on the details page).
*   **Voting:** Allows authenticated users to vote/support issues they haven't created or already voted for.
*   **Protected Routes:** Ensures only authenticated users can access certain pages (e.g., Report Issue, My Issues).
*   **Responsive Design:** Uses Tailwind CSS for adaptability across different screen sizes.
*   **Interactive Maps:** Uses React Leaflet for selecting locations and displaying issue markers.
*   **Notifications:** Provides user feedback using React Hot Toast for actions like login success/failure, issue reporting/updating, etc.

## Technology Stack

*   **Framework:** React v18+
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router DOM v6
*   **Styling:** Tailwind CSS
*   **UI Components:** Custom Components, Headless UI (implicitly via Tailwind examples), Lucide Icons
*   **State Management:** React Context API (`AuthContext`), `useState`, `useEffect`
*   **HTTP Client:** Axios (with interceptors for auth token)
*   **Mapping:** React Leaflet, Leaflet.js
*   **Notifications:** React Hot Toast
*   **Date Formatting:** date-fns

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A running instance of the [CivicSync Backend API](#) (The frontend needs to connect to this).

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    # Navigate specifically into the frontend directory if it's part of a monorepo
    cd <repository-directory>/<frontend-folder-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the frontend project directory. Add the following variable, pointing it to the URL where your CivicSync Backend API is running:

    ```.env
    # URL of the backend API server
    VITE_API_URL=http://localhost:5000
    ```
    *   Replace `http://localhost:5000` if your backend runs on a different port or domain.
    *   Vite requires environment variables accessible in the client-side code to be prefixed with `VITE_`.
    *   **Do not** commit your `.env` file to version control if it contains sensitive information (though in this case, the API URL is often okay).

## Running the Application

1.  **Development Mode:**
    Starts the Vite development server with Hot Module Replacement (HMR).
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173` (Vite's default port). Check the terminal output for the exact URL.

2.  **Build for Production:**
    Creates an optimized production build in the `dist/` directory.
    ```bash
    npm run build
    # or
    yarn build
    ```

3.  **Preview Production Build:**
    Runs a local server to preview the production build from the `dist/` directory. Useful for testing before deployment.
    ```bash
    npm run preview
    # or
    yarn preview
    ```

## Project Structure