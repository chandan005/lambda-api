import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

async function handleResponse(statusCode: number, message: any) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

async function handler(event: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> {
  try {
    const data: { url: string } = JSON.parse(event.body || '{}');
    console.log('Shopify URL', JSON.stringify(data));
    if (!data) {
      return handleResponse(200, data);
    } else {
      return handleResponse(404, {});
    }
  } catch (err) {
    console.log(err);
    return handleResponse(404, {});
  }
}

exports.handler = handler;
