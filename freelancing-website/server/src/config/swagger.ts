import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Freelancing Platform API",
      version: "1.0.0",
      description: "Interactive API documentation for the Freelancing Platform Express server.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "fp_token",
          description: "Authentication cookie `fp_token` containing JWT",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/server.ts", "./dist/routes/*.js", "./dist/server.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
