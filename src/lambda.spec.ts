import { handler } from '../src/lambda';

// Mock fetch function
jest.mock('node-fetch', () => jest.fn());

// Mock response data
const mockResponseData = {
  url: 'https://example.com',
  'min-tshirt-price': 10,
  'max-tshirt-price': 20,
  currency: 'USD',
};

describe('Handler function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no body is provided', async () => {
    const event = {};
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing body');
  });

  it('should return 400 if no URL is provided in the body', async () => {
    const event = { body: '{}' };
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing url');
  });

  it('should return 400 if an invalid search category is provided', async () => {
    const event = { body: '{"url": "example.com", "search": "invalid"}' };
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Invalid search category');
  });

  it('should fetch currency and product prices correctly', async () => {
    const event = { body: '{"url": "example.com"}' };
    const mockFetchResponse = {
      text: jest.fn().mockResolvedValue('<div data-currency="USD"></div>'),
      json: jest.fn().mockResolvedValue({
        products: [
          {
            product_type: 'T-Shirt',
            title: 'T-Shirt',
            handle: 't-shirt',
            tags: ['t-shirt'],
            variants: [{ price: '10.00' }, { price: '20.00' }],
          },
        ],
      }),
    };

    // (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponseData);
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      json: jest.fn().mockResolvedValue(mockResponseData),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
    });

    // (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(mockFetch);
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    const responseBody = JSON.parse(response.body);
    expect(responseBody.currency).toBe('USD');
    expect(responseBody['min-tshirt-price']).toBe(10);
    expect(responseBody['max-tshirt-price']).toBe(20);
  });
});
