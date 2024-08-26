const express = require("express");
const puppeteer = require("puppeteer");
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
  const { html } = req.body;
  const { width, height } = req.query;

  if (!html) {
    return res.status(400).send("HTML content is required in the request body");
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const viewportWidth = width ? parseInt(width) : 800;
    const viewportHeight = height ? parseInt(height) : 600;

    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    const screenshot = await page.screenshot({
      fullPage: !(width && height),
    });

    await browser.close();

    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (error) {
    console.error("Error converting HTML to image:", error);
    res.status(500).send("Error converting HTML to image");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
