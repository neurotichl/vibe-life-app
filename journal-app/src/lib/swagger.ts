import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '📖 Journal App API - LifeOS',
    version: '1.0.0',
    description: `
      Personal journaling API with mood tracking and cloud storage.
      
      **Features:**
      - 📝 Create and manage journal entries
      - 😊 Mood tracking with emoji support
      - 🏷️ Tag-based organization
      - ☁️ Google Cloud Storage persistence
      - 🤖 AI-ready endpoints for automated journaling
      
      **LifeOS Compatible:** Uses universal schema for multi-domain life data.
    `,
    contact: {
      name: 'LifeOS Journal API',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Journal',
      description: 'Personal journal entries with mood and tags',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/app/api/**/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);