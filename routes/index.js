const express = require("express");
const router = express.Router();

const cacheService = require("../utils/cacheService");
const CacheError = require("../models/CacheError");

const formatError = require("../utils/formatError");

/**
 * @swagger
 * definitions:
 *   Error:
 *     properties:
 *       error:
 *         type: object
 *         properties:
 *           issue:
 *             type: string
 *           details:
 *             type: object
 *         example: {
 *           'issue': 'Ошибка',
 *           'details': 'Подробности ошибки'
 *         }
 */

/**
 * @swagger
 *
 * /:
 *   get:
 *     summary: Проверка работоспособности API
 *     tags:
 *       - Info
 *     responses:
 *       200:
 *         description: Возвращает сообщение о работоспособности API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Добро пожаловать в наше REST API!'
 */
router.get("/", (req, res) => {
  res.json({ message: "Добро пожаловать в наше REST API!" });
});

/**
 * @swagger
 *
 * /query:
 *   post:
 *     summary: Запрос данных по URL
 *     tags:
 *       - Info
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *           example: {
 *             'url': 'https://http.cat/200'
 *           }
 *     responses:
 *       200:
 *         description: Ответные данные
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 */
router.post("/query", function (req, res) {
  const url = req.body.url;
  const fetchData = async (url) =>
    fetch(url)
      .then(async (data) => [
        Buffer.from(await data.arrayBuffer()),
        data.headers.get("Content-Type"),
        parseInt(data.headers.get("Content-Length")),
      ])
      .catch((e) => {
        throw e;
      });

  cacheService
    .update(url, fetchData)
    .then((item) => res.setHeader("Content-Type", item.type).send(item.data))
    .catch((e) => {
      if (!(e instanceof CacheError)) {
        res.status(500).send({
          error: formatError(`Запрос на '${url}' не выполнен`, e.message),
        });
      } else {
        fetchData(url)
          .then(([data, type]) =>
            res.setHeader("Content-Type", type).send(data),
          )
          .catch((e) => res.status(400).send({ error: e }));
      }
    });
});

module.exports = router;
