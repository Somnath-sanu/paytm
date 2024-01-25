import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { Account } from "../Model/Account.model.js";


const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    res.json({
      balance: account.balance,
      id : req.userId,
    });
  } catch (error) {
    res.status(401).json({message : "Error while fetching balance :", error});
  } 
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (!account || account.balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        // !    The $inc operator increments a field by a specified value.

        balance: amount,
      },
    }
  );

  res.json({
    message: "Transfer successful",
  });
});

export default router;
