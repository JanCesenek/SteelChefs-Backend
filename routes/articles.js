const express = require("express");
const { checkAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router
  .route("/articles")
  .get(async (_, res) => {
    try {
      const articles = await prisma.cook_articles.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching articles", error });
    }
  })
  .post(checkAuthMiddleWare, async (req, res) => {
    const data = req.body;
    const userMatch = await prisma.cook_users.findFirst({
      where: {
        username: req.token.username,
      },
    });
    if (userMatch && data.userID === userMatch?.id) {
      const newArticle = await prisma.cook_articles.create({
        data,
      });
      res.status(201).json({ message: "Article created successfully!", newArticle });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "You can't post articles for other users!" },
      });
    }
  });

router
  .route("/articles/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const article = await prisma.cook_articles.findUnique({
      where: {
        id,
      },
    });
    res.json(article);
  })
  .patch(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const data = req.body;
    const userMatch = await prisma.cook_users.findFirst({
      where: {
        username: req.token.username,
      },
    });
    const article = await prisma.cook_articles.findUnique({
      where: {
        id,
      },
    });
    if (userMatch && article && article?.userID === userMatch?.id) {
      const updatedArticle = await prisma.cook_articles.update({
        where: {
          id,
        },
        data,
      });
      res.json({ message: "Article updated successfully!", updatedArticle });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "You can't update articles for other users!" },
      });
    }
  })
  .delete(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const userMatch = await prisma.cook_users.findFirst({
      where: {
        username: req.token.username,
      },
    });
    const article = await prisma.cook_articles.findUnique({
      where: {
        id,
      },
    });
    if (userMatch && article && article?.userID === userMatch?.id) {
      await prisma.cook_articles.delete({
        where: {
          id,
        },
      });
      res.json({ message: "Article deleted successfully!" });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "You can't delete articles for other users!" },
      });
    }
  });

module.exports = router;
