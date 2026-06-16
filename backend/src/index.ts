import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`CodeMentor AI API running on port ${env.port}`);
});

// Trigger restart 2
