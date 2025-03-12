const express = require("express");
const { checkAuthMiddleWare, guestAuthMiddleWare } = require("../util/auth");

const router = express.Router();
const prisma = require("./prisma");

router
  .route("/ordered-units")
  .get(async (_, res) => {
    try {
      const orderedUnits = await prisma.cook_units.findMany();
      res.json(orderedUnits);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching ordered units", error });
    }
  })
  .post(guestAuthMiddleWare, async (req, res) => {
    const data = req.body;
    const [product, existingUnprocessedDelivery] = await prisma.$transaction([
      prisma.cook_products.findFirst({
        where: {
          id: data.productID,
        },
      }),
      prisma.cook_units.findFirst({
        where: {
          delivery: {
            not: null,
          },
          processed: false,
        },
      }),
    ]);
    if (
      (product && data.quantity && data.quantity <= product.quantity && !data.delivery) ||
      (data.quantity === 1 && data.delivery && !existingUnprocessedDelivery)
    ) {
      const newOrderedUnit = await prisma.cook_units.create({
        data,
      });
      res.status(201).json({ message: "Ordered unit created successfully!", newOrderedUnit });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Can't order more than available!" },
      });
    }
  });

router
  .route("/ordered-units/:id")
  .get(async (req, res) => {
    const id = +req.params.id;
    const orderedUnit = await prisma.cook_units.findUnique({
      where: {
        id,
      },
    });
    res.json(orderedUnit);
  })
  .patch(guestAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const data = req.body;

    if (data.processed) {
      const processedUnit = await prisma.cook_units.update({
        where: {
          id,
        },
        data,
      });
      return res.status(201).json({ message: "Unit processed successfully!", processedUnit });
    }

    console.log(data);
    const thisUnit = await prisma.cook_units.findFirst({ where: { id } });
    const product = await prisma.cook_products.findFirst({ where: { id: thisUnit?.productID } });
    if (
      (data.quantity >= 1 && Math.abs(data?.quantity - thisUnit?.quantity) <= product.quantity) ||
      (data.orderID && !data.processed)
    ) {
      const updatedUnit = await prisma.cook_units.update({
        where: {
          id,
        },
        data,
      });
      console.log(updatedUnit);
      res.status(201).json({ message: "Unit updated successfully!", updatedUnit });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Can update only own orders!" },
      });
    }
  })
  .delete(guestAuthMiddleWare, async (req, res) => {
    const id = +req.params.id;
    const thisUnit = await prisma.cook_units.findFirst({
      where: {
        id,
      },
    });

    let respectiveUser = null;

    if (thisUnit?.userID) {
      respectiveUser = await prisma.cook_users.findFirst({
        where: {
          id: thisUnit?.userID,
        },
      });
    }

    if ((respectiveUser && thisUnit.userID === respectiveUser.id) || !respectiveUser) {
      const deletedUnit = await prisma.cook_units.delete({
        where: {
          id,
        },
      });
      res.status(201).json({ message: "Unit deleted successfully!", deletedUnit });
    } else {
      res.status(401).json({
        message: "Not authorized.",
        errors: { hacking: "Can delete only own orders!" },
      });
    }
  });

module.exports = router;
