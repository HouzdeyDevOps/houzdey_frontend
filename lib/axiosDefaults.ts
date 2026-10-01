import axios from 'axios';

// Ensures every raw `axios.*` call (not just the two configured instances) sends the httpOnly auth cookies.
axios.defaults.withCredentials = true;
