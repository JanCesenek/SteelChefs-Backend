const express = require("express");
const { checkAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router
  .route("/images")
  .get(async (_, res) => {
    try {
      const images = await prisma.cook_images.findMany();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching images", error });
    }
  })
  .post(checkAuthMiddleWare, async (req, res) => {
    const data = req.body;
    if (req.token.admin) {
      const newImage = await prisma.cook_images.create({
        data,
      });
      res.status(201).json({ message: "Image created successfully!", newImage });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can create new images!" },
      });
    }
  });

router
  .route("/images/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const image = await prisma.cook_images.findUnique({
      where: {
        id,
      },
    });
    res.json(image);
  })
  .patch(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const data = req.body;
    if (req.token.admin) {
      const updatedImage = await prisma.cook_images.update({
        where: {
          id,
        },
        data,
      });
      res.status(201).json({ message: "Image updated successfully!", updatedImage });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can update images!" },
      });
    }
  })
  .delete(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    if (req.token.admin) {
      const deletedImage = await prisma.cook_images.delete({
        where: {
          id,
        },
      });
      res.status(201).json({ message: "Image deleted successfully!", deletedImage });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can delete images!" },
      });
    }
  });

module.exports = router;
