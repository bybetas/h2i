const express = require("express");
const { chromium } = require("playwright");
const app = express();
const port = process.env.PORT || 8888;
const renderSecret = process.env.H2I_RENDER_SECRET || "";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.redirect("https://github.com/bybetas/h2i");
});

const checkRenderSecret = (req, res, next) => {
  const providedSecret = req.headers["x-render-secret"];

  if (renderSecret && providedSecret !== renderSecret) {
    return res.status(403).send("Invalid render secret");
  }
  next();
};

app.post("/convert", checkRenderSecret, async (req, res) => {
  const { html, url } = req.body;
  const { width, height } = req.query;

  if (!html && !url) {
    return res
      .status(400)
      .send("Either HTML content or a URL is required in the request body");
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
