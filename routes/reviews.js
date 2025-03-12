const express = require("express");
const { checkAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router
  .route("/reviews")
  .get(async (_, res) => {
    try {
      const reviews = await prisma.cook_reviews.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching reviews", error });
    }
  })
  .post(checkAuthMiddleWare, async (req, res) => {
    const data = req.body;
    const existingReview = await prisma.cook_reviews.findFirst({
      where: {
        userID: data.userID,
      },
    });
    const userMatch = await prisma.cook_users.findFirst({
      where: {
        username: req.token.username,
      },
    });

    if (userMatch && !existingReview && userMatch?.id === data.userID) {
      const newReview = await prisma.cook_reviews.create({
        data,
      });
      res.status(201).json({ message: "Review created successfully!", newReview });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "You can't have more than one review!" },
      });
    }
  });

router
  .route("/reviews/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const review = await prisma.cook_reviews.findUnique({
      where: {
        id,
      },
    });
    res.json(review);
  })
  .delete(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const thisReview = await prisma.cook_reviews.findUnique({
      where: {
        id,
      },
    });
    const thisUser = await prisma.cook_users.findFirst({
      where: {
        username: req.token.username,
      },
    });
    if ((thisReview && thisUser && thisUser?.id === thisReview.userID) || req.token.admin) {
      const deletedReview = await prisma.cook_reviews.delete({
        where: {
          id,
        },
      });
      res.json({ message: "Review deleted successfully!", deletedReview });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "You can't delete other user's reviews!" },
      });
    }
  });

module.exports = router;
