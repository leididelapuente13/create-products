import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider();

export const verifyToken = async (token: string): Promise<string | null> => {
  try {
    const params = {
      AccessToken: token,
    };
    const response = await cognito.getUser(params).promise();
    return response.Username || null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
