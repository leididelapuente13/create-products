import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductInput } from './interfaces';


const dynamoDb = new DynamoDB.DocumentClient();

export const createProduct = async (product: ProductInput, userId: string): Promise<Product> => {
  const timestamp = new Date().toISOString();
  const newProduct: Product = {
    uuid: uuidv4(),
    name: product.name,
    brand: product.brand,
    categories: product.categories,
    price: product.price,
    userId,
    createdAt: timestamp
  };

  const params = {
    TableName: process.env.PRODUCTS_TABLE!,
    Item: newProduct
  };

  await dynamoDb.put(params).promise();
  return newProduct;
};