# HTML to Image API (H2I)

This API provides a service to convert HTML content or a URL into JPEG images using Playwright. It's designed to be simple, efficient, and deployable on platforms like Railway.

## Endpoints

### HTML to Image Conversion

- **URL**: `/convert`
- **Method**: `POST`
- **Description**: Converts provided HTML content, a URL, or a base64 HTML string into a JPEG image.
- **Headers**:
  - `X-Render-Secret` (optional): The secret key for authentication if `H2I_RENDER_SECRET` is set
- **Body**:
  - Content-Type: `application/json`
  - Required field: Either `html` (string) - The HTML content to be converted, `url` (string) - The URL of the page to be converted, or `html64` (string) - The base64 encoded HTML content to be converted
- **Query Parameters**:
  - `width` (optional): Desired width of the output image in pixels
  - `height` (optional): Desired height of the output image in pixels
- **Response**:
  - Content-Type: `image/jpeg`
  - The JPEG image of the rendered HTML, URL, or base64 HTML string

## Authentication

If the `H2I_RENDER_SECRET` environment variable is set, clients must provide the correct secret in the `X-Render-Secret` header when making requests to the `/convert` endpoint. If the secret is not set (empty string), the server will allow all requests without checking for a secret.

## Usage

### Basic Usage with HTML

To convert HTML to an image:

```http
POST /convert
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "html": "<html><body><h1>Hello, World!</h1></body></html>"
}
```

### Basic Usage with URL

To convert a URL to an image:

```http
POST /convert
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "url": "https://example.com"
}
```

### Specifying Dimensions

To convert HTML or a URL to an image with specific dimensions:

```http
POST /convert?width=800&height=600
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "html": "<html><body><h1>Hello, World!</h1></body></html>"
}
```

Or for a URL:

```http
POST /convert?width=800&height=600
Content-Type: application/json
X-Render-Secret: your_secret_here

{
  "url": "https://example.com"
}
```

## License
MIT License: You can do almost anything with this software, as long as you include the original license and copyright notice.

### Key Changes:
- **JPEG Format**: Updated the response content type to `image/jpeg` to match the code.
- **URL Support**: Added support for converting URLs alongside HTML content.
- **Examples**: Provided examples for both HTML and URL conversions.
