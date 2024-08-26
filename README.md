# HTML to Image API (H2I)

This API provides a service to convert HTML content into PNG images using Puppeteer. It's designed to be simple, efficient, and deployable on platforms like Railway.

## Endpoints
### HTML to Image Conversion

- **URL**: `/convert`
- **Method**: `POST`
- **Description**: Converts provided HTML content into a PNG image.
- **Body**:
  - Content-Type: `application/json`
  - Required field: `html` (string) - The HTML content to be converted
- **Query Parameters**:
  - `width` (optional): Desired width of the output image in pixels
  - `height` (optional): Desired height of the output image in pixels
- **Response**:
  - Content-Type: `image/png`
  - The PNG image of the rendered HTML

## Usage

### Basic Usage

To convert HTML to an image:

```http
POST /convert
Content-Type: application/json

{
  "html": "<html><body><h1>Hello, World!</h1></body></html>"
}
