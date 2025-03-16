const express = require("express");
const { checkAuthMiddleWare, guestAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router.get("/last-order", async (_, res) => {
  const lastOrder = await prisma.cook_orders.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(lastOrder);
});

router
  .route("/orders")
  .get(async (_, res) => {
    try {
      const orders = await prisma.cook_orders.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  })
  .post(guestAuthMiddleWare, async (req, res) => {
    const data = req.body;
    let user = null;

    if (data.userID) {
      user = await prisma.cook_users.findFirst({
        where: {
          id: data.userID,
        },
      });
    }

    if (!data.userID || (user && data.userID === user.id) || req.token.admin) {
      const newOrder = await prisma.cook_orders.create({
        data,
      });
      res.status(201).json({ message: "Order created successfully!", newOrder });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Can't create orders for other users!" },
      });
    }
  });

router
  .route("/orders/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const order = await prisma.cook_orders.findUnique({
      where: {
        id,
      },
    });
    res.json(order);
  })
  .patch(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const data = req.body;
    if (req.token.admin) {
      const updatedOrder = await prisma.cook_orders.update({
        where: {
          id,
        },
        data,
      });
      res.status(201).json({ message: "Order updated successfully!", updatedOrder });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can update orders!" },
      });
    }
  })
  .delete(checkAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;

    const thisOrder = await prisma.cook_orders.findUnique({
      where: {
        id,
      },
    });

    if (req.token.admin) {
      const [deletedOrder, deletedImages, deletedUnits] = await prisma.$transaction([
        prisma.cook_orders.delete({
          where: {
            id,
          },
        }),
        prisma.cook_images.deleteMany({
          where: {
            productID: id,
          },
        }),
        prisma.cook_units.deleteMany({
          where: {
            orderID: thisOrder.unitsID,
          },
        }),
      ]);
      res.status(201).json({
        message: "Order deleted successfully!",
        deletedOrder,
        deletedImages,
        deletedUnits,
      });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Only admins can delete orders!" },
      });
    }
  });

module.exports = router;
