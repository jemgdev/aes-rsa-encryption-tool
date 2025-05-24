import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { app } from './main'; // Import the Express app

// Create a server instance for aws-serverless-express
const binaryMimeTypes: string[] = ['*/*'];
const server = awsServerlessExpress.createServer(app, undefined, binaryMimeTypes);

// Export the handler function
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
