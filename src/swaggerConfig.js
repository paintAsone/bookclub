const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        myapi: '1.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation',
        }
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions)

module.exports = { swaggerUi, swaggerSpec }