const path = require("path");
const express = require("express");
const PORT = 3000;

const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/v1/",
  createProxyMiddleware({
    target: "https://api.openai.com",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) =>
    {
      const bearerToken = req.headers.authorization;
      console.log(req.originalUrl);
      if (bearerToken)
      {
        proxyReq.setHeader("Authorization", bearerToken);
      }
    },
    onProxyRes: (proxyRes, req, res) =>
    {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      proxyRes.headers["Access-Control-Allow-Headers"] =
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With";
    },
  })
);
app.listen(PORT, '0.0.0.0', () =>
{
  console.log(`server running on http://0.0.0.0:${PORT}`);
})
  .on("error", (err) =>
  {
    console.log(err);
  });