const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const PORT = process.env.PORT || 3000;

const indexRouter = require("./routes/index");
const cacheRouter = require("./routes/cache");
const itemsRouter = require("./routes/items");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API пример",
      version: "1.0.0",
      description: 'Пример REST API с CRUD-операциями для ресурса "items"',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: `Локальный сервер, использующий порт ${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use("/", indexRouter);
app.use("/cache", cacheRouter);
app.use("/items", itemsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
