import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const dynamoDBClient = new DynamoDBClient({ region: 'us-west-1' });

export const handler: APIGatewayProxyHandler = async (event) => {
  const token = event.headers['authorization']?.split(' ')[1];

  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const decoded =  jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string };;

  if (!decoded.id) {
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
    userId: decoded.id,
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