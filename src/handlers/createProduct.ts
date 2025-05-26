import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../utils/auth';

const dynamoDBClient = new DynamoDBClient({ region: 'us-west-1' });

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const token = event.headers['Authorization']?.split(' ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  const { name, brand, categories, price } = JSON.parse(event.body || '{}');
  if (!name || !brand || !categories || price == null) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const product = {
    uuid: uuidv4(),
    name,
    brand,
    categories,
    price,
    userId,
    createdAt: new Date().toISOString(),
  };

  try {
    const params = {
      TableName: 'Products',
      Item: marshall(product),
    };
    await dynamoDBClient.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Producto registrado exitosamente',
        data: product,
      }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
