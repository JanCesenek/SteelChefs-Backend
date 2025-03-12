const express = require("express");
const { checkAuthMiddleWare, guestAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router
  .route("/products")
  .get(async (_, res) => {
    try {
      const products = await prisma.cook_products.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  })
  .post(checkAuthMiddleWare, async (req, res) => {
    const data = req.body;
    if (req.token.admin) {
      const newProduct = await prisma.cook_products.create({
        data,
      });
      res.status(201).json({ message: "Product created successfully!", newProduct });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can create new products!" },
      });
    }
  });

router
  .route("/products/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const product = await prisma.cook_products.findUnique({
      where: {
        id,
      },
    });
    res.json(product);
  })
  .patch(guestAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const data = req.body;
    if (req.token.admin || data.quantity) {
      const updatedProduct = await prisma.cook_products.update({
        where: {
          id,
        },
        data,
      });
      res.status(201).json({ message: "Product updated successfully!", updatedProduct });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can update products!" },
      });
    }
  })
  .delete(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    if (req.token.admin) {
      const deletedProduct = await prisma.cook_products.delete({
        where: {
          id,
        },
      });
      res.status(201).json({ message: "Product deleted successfully!", deletedProduct });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can delete products!" },
      });
    }
  });

module.exports = router;
