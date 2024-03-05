import { IProduct } from './interfaces/IProduct';
import { IVariant } from './interfaces/IVariant';

const productCategorySearch = [
  {
    type: 't-shirt',
    searchTerms: ['t-shirts', 't-shirt', 'tshirts', 'tshirt'],
  },

  {
    type: 'bottoms',
    searchTerms: ['bottom', 'bottoms'],
  },
];

interface ShopifyData {
  url: string;
  search?: string;
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
    console.log(error);
    throw new Error('Failed to fetch currency');
  }
};

const getMinMaxPrices = async (url: string, search?: string): Promise<[number, number]> => {
  try {
    let searchTerms: string[] = [];
    const defaultCategory = productCategorySearch.find((category) => category.type === 't-shirt');
    searchTerms = defaultCategory
      ? defaultCategory.searchTerms
      : ['t-shirts', 't-shirt', 'tshirts', 'tshirt'];

    if (search) {
      const matchingCategory = productCategorySearch.find((category) => category.type === search);
      if (matchingCategory) {
        searchTerms = matchingCategory.searchTerms;
      }
    }
    const response = await fetch(`${url}/products.json`);
    const productsData = await response.json();
    const prices: number[] = [];

    productsData.products.forEach((product: IProduct) => {
      product.variants.forEach((variant: IVariant) => {
        const productType = product.product_type.toLowerCase();
        const title = product.title.toLowerCase();
        const handle = product.handle.toLowerCase();
        const tags = product.tags.map((tag: string) => tag.toLowerCase());

        // Check if any of the search terms are found in any relevant fields
        const found = searchTerms.some((term) => {
          return (
            productType.includes(term) ||
            title.includes(term) ||
            handle.includes(term) ||
            tags.some((tag) => tag.includes(term))
          );
        });

        if (found) {
          const price = parseFloat(variant.price);
          if (!isNaN(price)) {
            prices.push(price);
          }
        }
      });
    });

    const minTshirtPrice = Math.min(...prices);
    const maxTshirtPrice = Math.max(...prices);
    const minPrice = isFinite(minTshirtPrice) ? minTshirtPrice : 0;
    const maxPrice = isFinite(maxTshirtPrice) ? maxTshirtPrice : 0;
    return [minPrice, maxPrice];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch product prices');
  }
};

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return handleResponse(400, 'Missing body');
    }
    const data: ShopifyData = JSON.parse(event.body);
    let { url, search } = data;
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }

    if (!url) {
      return handleResponse(400, 'Missing url');
    }

    const currency = await getCurrency(url);
    const [minPrice, maxPrice] = await getMinMaxPrices(url, search);

    const responseData: ResponseData = {
      url,
      'min-tshirt-price': minPrice,
      'max-tshirt-price': maxPrice,
      currency,
    };

    return handleResponse(200, responseData);
  } catch (error: any) {
    console.error(error);
    return handleResponse(500, error.message);
  }
};
