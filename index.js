/**
 * The Entry Point of the application
 * Sets up following:
 * Environment Variables
 * Express server
 * Database
 * And Finally Spins up the server
 */

/* Configure Environment Variables */
require('dotenv').config({ path: './.env' })

/* Set up logger */

// Setup Express Server
const app = require('./app')

/* Set Up Database */
require('./config')

/* Start Server */
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Running at ${process.env.PORT || 3000}`)
})