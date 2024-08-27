const express = require("express");
const { chromium } = require("playwright");
const app = express();
const port = process.env.PORT || 8888;
const renderSecret = process.env.H2I_RENDER_SECRET || "";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HTML to Image microservice is running",
  });
});

const checkRenderSecret = (req, res, next) => {
  const providedSecret = req.headers["x-render-secret"];

  if (renderSecret && providedSecret !== renderSecret) {
    return res.status(403).send("Invalid render secret");
  }
  next();
};

app.post("/convert", checkRenderSecret, async (req, res) => {
  const { html, url, html64 } = req.body; // Added html64 to the destructured body
  const { width, height } = req.query;

  if (!html && !url && !html64) {
    // Updated condition to check for html64
    return res
      .status(400)
      .send(
        "Either HTML content, a URL, or a base64 HTML string is required in the request body"
      );
  }

  let browser;
  try {
    console.log("Launching browser...");
    browser = await chromium.launch();

    console.log("Creating new page...");
    const page = await browser.newPage();

    const viewportWidth = width ? parseInt(width) : 1280;
    const viewportHeight = height ? parseInt(height) : 800;

    console.log(`Setting viewport to ${viewportWidth}x${viewportHeight}`);
    await page.setViewportSize({
      width: viewportWidth,
      height: viewportHeight,
    });

    if (url) {
      console.log(`Navigating to URL: ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });
    } else if (html) {
      console.log("Setting page content...");
      await page.setContent(html, { waitUntil: "networkidle" });
    } else if (html64) {
      // Added handling for html64
      console.log("Decoding base64 HTML content...");
      const decodedHtml = Buffer.from(html64, "base64").toString("utf-8");
      console.log("Setting page content from base64...");
      await page.setContent(decodedHtml, { waitUntil: "networkidle" });
    }

    console.log("Taking screenshot...");
    const screenshot = await page.screenshot({
      fullPage: !(width && height),
      type: "jpeg",
      quality: 80,
    });

    console.log("Screenshot taken, sending response...");
    res.set("Content-Type", "image/jpeg");
    res.send(screenshot);
  } catch (error) {
    console.error("Error converting HTML or URL to image:", error);
    res
      .status(500)
      .send("Error converting HTML or URL to image: " + error.message);
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
