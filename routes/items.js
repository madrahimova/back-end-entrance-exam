const express = require("express");
const router = express.Router();

const cacheService = require("../utils/cacheService");
const CacheError = require("../models/CacheError");
const Errors = require("../config/ErrorConfig");

const formatError = require("../utils/formatError");

/**
 * @swagger
 * definitions:
 *   Item:
 *     properties:
 *       data:
 *         type: object
 *       type:
 *         type: string
 *       size:
 *         type: integer
 *     example: {
 *       'data': 'Hello World!',
 *       'type': 'text/plain',
 *       'size': 12
 *     }
 *   ComplexItem:
 *     allOf:
 *       - $ref: '#/definitions/Item'
 *       - properties:
 *           id:
 *             type: integer
 *     example: {
 *       'id': 1,
 *       'data': 'Hello World!',
 *       'type': 'text/plain',
 *       'size': 12
 *     }
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Операции с ресурсом 'items'
 */

/**
 * @swagger
 *
 * /items:
 *   get:
 *     summary: Получить список всех элементов
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Список всех элементов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/definitions/ComplexItem'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 */
router.get("/", (req, res) => {
  cacheService
    .readAll()
    .then((items) => res.send({ items: items }))
    .catch((e) => {
      if (e instanceof CacheError) {
        res.status(400).send({ error: e });
      } else {
        res.status(500).send({
          error: formatError("Невозможно получить элементы", e.message),
        });
      }
    });
});

/**
 * @swagger
 *
 * /items/{id}:
 *   get:
 *     summary: Получить элемент по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Запрашиваемый элемент
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *                   $ref: '#/definitions/ComplexItem'
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 *       404:
 *         description: Не найдено
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
router.get("/:id", (req, res) => {
  cacheService
    .read(req.params.id)
    .then((item) => res.status(200).send({ item: item }))
    .catch((e) => {
      if (e instanceof CacheError) {
        if (e.details === Errors.ITEM_NOT_FOUND) {
          res.status(404).send({ error: e });
        } else {
          res.status(400).send({ error: e });
        }
      } else {
        res.status(500).send({
          error: formatError("Невозможно получить элемент", e.message),
        });
      }
    });
});

/**
 * @swagger
 *
 * /items:
 *   post:
 *     summary: Создать новый элемент
 *     tags:
 *       - Items
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/Item'
 *     responses:
 *       201:
 *         description: Созданная запись
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *                   $ref: '#/definitions/ComplexItem'
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
router.post("/", (req, res) => {
  cacheService
    .write(req.body.data, req.body.type, req.body.size)
    .then((item) => res.status(201).send({ item: item }))
    .catch((e) => {
      if (e instanceof CacheError) {
        res.status(400).send({ error: e });
      } else {
        res.status(500).send({
          error: formatError("Невозможно создать элемент", e.message),
        });
      }
    });
});

/**
 * @swagger
 *
 * /items/{id}:
 *   put:
 *     summary: Обновить элемент по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Item'
 *
 *     responses:
 *       200:
 *         description: Обновленная запись
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *                   $ref: '#/definitions/ComplexItem'
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 *       404:
 *         description: Не найдено
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
router.put("/:id", (req, res) => {
  cacheService
    .updateItem(req.params.id, req.body.data, req.body.type, req.body.size)
    .then((item) => res.send({ item: item }))
    .catch((e) => {
      if (e instanceof CacheError) {
        if (e.details === Errors.ITEM_NOT_FOUND) {
          res.status(404).send({ error: e });
        } else {
          res.status(400).send({ error: e });
        }
      } else {
        res.status(500).send({
          error: formatError("Невозможно обновить элемент", e.message),
        });
      }
    });
});

/**
 * @swagger
 *
 * /items/{id}:
 *   delete:
 *     summary: Удалить элемент по ID
 *     tags:
 *       - Items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Успешное удаление записи
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/Error'
 *       404:
 *         description: Не найдено
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
router.delete("/:id", (req, res) => {
  cacheService
    .delete(req.params.id)
    .then((ok) => res.status(204).send(ok))
    .catch((e) => {
      if (e instanceof CacheError) {
        if (e.details === Errors.ITEM_NOT_FOUND) {
          res.status(404).send({ error: e });
        } else {
          res.status(400).send({ error: e });
        }
      } else {
        res.status(500).send({
          error: formatError("Невозможно удалить элемент", e.message),
        });
      }
    });
});

/**
 * @swagger
 *
 * /items:
 *   delete:
 *     summary: Удалить все элементы
 *     tags:
 *       - Items
 *     responses:
 *       204:
 *         description: Успешное удаление записей
 */
router.delete("/", (req, res) => {
  cacheService.deleteAll(req.params.id).then((ok) => res.status(204).send(ok));
});

module.exports = router;
