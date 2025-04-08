// const next = require("next");
// const https = require("https");
// const fs = require("fs");
// const express = require("express");

// const dev = process.env.NEXT_NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Example: Set up custom routes, middleware, etc.

//   // Handle all Next.js requests
//   server.use((req, res) => {
//     return handle(req, res);
//   });

//   // Use HTTPS if configured
//   https
//     .createServer(
//       {
//         key: fs.readFileSync("./ssl/localhost.key"),
//         cert: fs.readFileSync("./ssl/localhost.crt"),
//       },
//       server
//     )
//     .listen(3000, (err) => {
//       if (err) throw err;
//       console.log("> Ready on https://localhost:3000");
//     });
// });
