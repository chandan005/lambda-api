# lambda-api

An API that returns Shopify store prices based on a category. This application is deployed using AWS SAM (Serverless Application Model) along with CloudFormation. It utilizes Lambda for server-side logic and is built using TypeScript and Node.js.

## Description

An API that returns Shopify store prices based on a category.

## Installation

To use this application, make sure you have Node.js and AWS SAM installed on your system. Then, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/chanda005/lambda-api.git

2. CD to directory
    ```bash
   cd lambda-api
3. Install dependencies
    ```
   npm install

## Usage
To run the application locally, use the following command:
1. Run Locally
    ```bash
    npm run local

## Deployment
The deployment is done via github actions. However, there is also provision to use AWS SAM and Cloudformation if required.
1. Install AWS SAM CLI by following the instructions provided in the AWS SAM documentation.
2. Build (Make sure to update the aws role in template.yaml)
    ```bash
    sam build
3. Deploy
    ```bash
    sam deploy

## API Usage
To use the application directly via Postman or Curl, use the following url.
1. API URL -> POST
    ```bash

Make sure to replace `"# Replace with your actual API URL"` with the actual URL of your deployed API endpoint. This updated readme provides clear instructions for installation, usage, and deployment of the application, along with mentioning the technologies used and how to access the deployed application.


## Solution Architecture and Logic
The lambda-api utilizes AWS Lambda and API Gateway for handling HTTP requests. Here's an overview of its architecture and logic:

```javascript
{
  "url": "shopify_store_url",
  "search": "optional_search_term"
}
```

The "url" field specifies the Shopify store URL.
The "search" field is optional and can be used to filter products based on a specific category.

* Input Processing: The API accepts HTTP requests, which can include optional parameters such as the URL of the Shopify store and a search term for a specific product category.

* Fetching Data: Upon receiving a request, the API fetches data from the provided Shopify store URL. It retrieves product information from the products.json endpoint and extracts relevant details such as product type, title, handle, and tags.

* Filtering by Category: The API filters products based on the specified category (e.g., "t-shirt" or "bottoms") and associated search terms. It checks various fields including product type, title, handle, and tags to identify products belonging to the specified category.

* Price Calculation: After filtering the products, the API calculates the minimum and maximum prices of the products in the selected category.

* Output Generation: Finally, the API generates a response containing the minimum and maximum prices along with the currency information. This response is returned to the client making the request.

```javascript
{
  "url": "shopify_store_url",
  "minimum_tshirt_price": 21,
  "maximum_tshirt_price": 139,
  "currency": "USD"
}
```

## Key Features
Dynamic Category Filtering: The API allows users to specify a category for price retrieval, making it flexible and customizable.

Error Handling: The API handles errors gracefully, providing informative responses in case of failures during data retrieval or processing.

## Challenges Faced
Understanding Shopify Data Structure: Initially, there was a challenge in understanding the structure of Shopify data and how to retrieve relevant information such as product prices and categories.

Obtaining Currency Information: The currency information was not readily available in the products.json file. As a workaround, an additional step was implemented to fetch currency data from the Shopify store.

By leveraging AWS Lambda, API Gateway, TypeScript, and Node.js, the lambda-api provides a scalable and efficient solution for retrieving Shopify store prices based on specific categories.