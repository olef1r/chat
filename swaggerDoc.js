const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc');

let swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:8080',
    basePath: '/',
  };
  // options for the swagger docs
let options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['routes.js']// pass all in array 
    };
  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJsDoc(options);


module.exports = app => { 
    app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(options));
}

