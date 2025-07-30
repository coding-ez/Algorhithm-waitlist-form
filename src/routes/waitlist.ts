import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { waitlistSchema } from "../schemas/waitlistSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = Router();
const prisma = new PrismaClient();


router.post("/waitlist", async (req, res) => {
  const parsed = waitlistSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.format(),
    });
  }

  const {
    name,
    age,
    userType,
    orgName,
    city,
    email,
    phone,
    updates,
  } = parsed.data;

  try {
    const entry = await prisma.waitlistEntry.create({
      data: {
        name,
        age,
        userType,
        orgName,
        city,
        email,
        phone,
        updates,
      },
    });

    return res.status(201).json({ success: true, entry });

  } catch (error: any) {
    // Handle Prisma unique constraint error
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta?.target.includes("email")
    ) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
