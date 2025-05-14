# Click Fit

A sports and fitness website.

## Setup

### Frontend

- Open `frontend/index.html` in your browser.

### Backend

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm start` (you'll need to define this script in `package.json`)

### Database (MySQL)

1. Ensure you have a MySQL server running.
2. Connect to your MySQL instance.
3. Run the scripts in the `sql/` directory in the following order:
   - `schema.sql` (to create tables)
   - `stored_procedures.sql` (to create stored procedures)
   - `sample_data.sql` (to insert initial data - optional)