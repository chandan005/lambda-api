import { APIGatewayProxyHandler } from 'aws-lambda';
import { IProduct } from './interfaces/IProduct';
import { IVariant } from './interfaces/IVariant';

interface ShopifyData {
  url: string;
}

interface ResponseData {
  url: string;
  'min-tshirt-price': number;
  'max-tshirt-price': number;
  currency: string;
}

async function handleResponse(statusCode: number, message: any) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

const getCurrency = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`${url}/shop.json`);
    const shopData = await response.text();
    const match = shopData.match(/data-currency="(\w+)"/);
    if (match) {
      return match[1];
    }
    throw new Error('Currency not found');
  } catch (error) {
    throw new Error('Failed to fetch currency');
  }
};

const getMinMaxPrices = async (url: string): Promise<[number, number]> => {
  try {
    const response = await fetch(`${url}/products.json`);
    const productsData = await response.json();
    const tShirtPrices: number[] = [];

    productsData.products.forEach((product: IProduct) => {
      product.variants.forEach((variant: IVariant) => {
        const productType = product.product_type.toLowerCase();
        if (productType.includes('t-shirt') || productType.includes('shirt')) {
          const price = parseFloat(variant.price);
          if (!isNaN(price)) {
            tShirtPrices.push(price);
          }
        }
      });
    });

    const minTshirtPrice = Math.min(...tShirtPrices);
    const maxTshirtPrice = Math.max(...tShirtPrices);
    return [minTshirtPrice, maxTshirtPrice];
  } catch (error) {
    throw new Error('Failed to fetch product prices');
  }
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const data: ShopifyData = JSON.parse(event.body!);
    const { url } = data;

    if (!url) {
      return handleResponse(400, 'Missing url');
    }

    const currency = await getCurrency(url);
    const [minPrice, maxPrice] = await getMinMaxPrices(url);

    const responseData: ResponseData = {
      url,
      'min-tshirt-price': minPrice,
      'max-tshirt-price': maxPrice,
      currency,
    };

    return handleResponse(200, responseData);
  } catch (error: any) {
    return handleResponse(500, error.message);
  }
};
