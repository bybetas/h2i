# HTML to Image API (H2I)

This API provides a service to convert HTML content into PNG images using Puppeteer. It's designed to be simple, efficient, and deployable on platforms like Railway.

## Endpoints

### HTML to Image Conversion

- **URL**: `/convert`
- **Method**: `POST`
- **Description**: Converts provided HTML content into a PNG image.
- **Headers**:
  - `X-Render-Secret` (optional): The secret key for authentication if `H2I_RENDER_SECRET` is set
- **Body**:
  - Content-Type: `application/json`
  - Required field: `html` (string) - The HTML content to be converted
- **Query Parameters**:
  - `width` (optional): Desired width of the output image in pixels
  - `height` (optional): Desired height of the output image in pixels
- **Response**:
  - Content-Type: `image/png`
  - The PNG image of the rendered HTML

## Authentication

If the `H2I_RENDER_SECRET` environment variable is set, clients must provide the correct secret in the `X-Render-Secret` header when making requests to the `/convert` endpoint. If the secret is not set (empty string), the server will allow all requests without checking for a secret.

## Usage

### Basic Usage

To convert HTML to an image:

```http
POST /convert
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "html": "<html><body><h1>Hello, World!</h1></body></html>"
}
```

### Specifying dimensions

To convert HTML to an image with specific dimensions:

```http
POST /convert?width=800&height=600
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "html": "<html><body><h1>Hello, World!</h1></body></html>"
}
```
