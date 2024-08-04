const express = require("express");
const router = express.Router();

const cacheService = require("../utils/cacheService");
const CacheError = require("../models/CacheError");

const formatError = require("../utils/formatError");

/**
 * @swagger
 * definitions:
 *   Cache:
 *     properties:
 *       cache:
 *         type: object
 *         properties:
 *           capacity:
 *             type: integer
 *           size:
 *             type: integer
 *         example: {
 *           "capacity": 1048576,
 *           "size": 1024
 *         }
 */

/**
 * @swagger
 * tags:
 *   name: Cache
 *   description: Операции с ресурсом "Cache"
 */

/**
 * @swagger
 *
 * /cache:
 *   get:
 *     summary: Получить сведения о кеше
 *     tags:
 *       - Cache
 *     responses:
 *       200:
 *         description: Кеш
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Cache'
 */
router.get("/", function (req, res) {
  res.send({ cache: cacheService.cache });
});

/**
 * @swagger
 *
 * /cache/capacity:
 *   put:
 *     summary: Изменить емкость кеша
 *     tags:
 *       - Cache
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacity:
 *                 type: integer
 *           example: {
 *             "capacity": 1048576
 *           }
 *     responses:
 *       200:
 *         description: Кеш с новой емкостью
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Cache'
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
router.put("/capacity", function (req, res) {
  cacheService
    .updateCapacity(req.body.capacity)
    .then((cache) => res.send({ cache: cache }))
    .catch((e) => {
      if (e instanceof CacheError) {
        res.status(400).send({ error: e });
      } else {
        res.status(500).send({
          error: formatError("Невозможно изменить емкость кеша", e.message),
        });
      }
    });
});

module.exports = router;
