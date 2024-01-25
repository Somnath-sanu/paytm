import { Router } from "express";
import zod from "zod";
import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import { User } from "../Model/User.model.js";
import { authMiddleware } from "../middleware.js";
import { Account } from "../Model/Account.model.js";

const router = Router();
// Zod Schema
const signupBody = zod.object({
  //! signupBody Schema
  username: zod.string({ required_error: "Username is required" }).email(),
  firstName: zod.string({ required_error: "firstName is required" }).trim(),
  lastName: zod.string({ required_error: "lastName is required" }).trim(),
  password: zod.string({ required_error: "Password is required" }).min(4),
});

router.post("/signup", async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/Incorrect inputs",
      });
    }

    // const {username , password , firstName , lastName} = req.body;
    // const user = await User.create({username , password , firstName , lastName})

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const userId = user._id;

    //! ----- Create new account ------

    await Account.create({
      userId,
      balance: 1 + Math.random() * 1000,
    });

    //! -----  ------

    const token = jwt.sign(
      {
        userId, // ! Payload // userId : userId
      },
      JWT_SECRET
    );

    res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    res.status(401).json({
      message : "Error while creating user :", error
    });
  }
});

// Zod signinBody Schema

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(4),
});

//! safeParse method of a zod.object returns an object with three properties: data , error and success -->{ success: true; data: "tuna" } -->
//! { success: false; error: ZodError }.

//! 411 --> server refuses to accept the request ( client error )

router.post("/signin", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }

    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET
      );

      res.json({
        token: token,
      });
      return;
    }

    res.status(411).json({
      message: "Error while logging in",
    });
  } catch (error) {
    res.send("Error occured while logging in :", error);
  }
});

const updatedBody = zod.object({
  //! updatedBody schema
  password: zod.string().optional(),
  firstName: zod.string().optional(), 
  lastName: zod.string().optional(),
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { success } = updatedBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Error while updating information",
      });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    // await User.updateOne(req.body, {
    //   id: req.userId,
    // });

    res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    res.json({
      message: "Error while updating information ",
      error,
    });
  }
});

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      //! the User.find() method in Mongoose returns an array of documents that match the specified query criteria.
      $or: [
        { firstName: { $regex: filter } },
        { lastName: { $regex: filter } },
      ],
    });

    res.json({
      user: users.map((user) => ({
        //! we dont have to send password so be carefull
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    res.json({ msg: "Error while fetching User from DB ", error });
  }
});

export default router;
