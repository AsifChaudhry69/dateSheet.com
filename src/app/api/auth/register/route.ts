/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User registered successfully"
 *               data:
 *                 user:
 *                   id: "clx1234abcd"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: All fields are required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "All fields are required"
 *               data: null
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email already registered"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error"
 *               data: null
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createResponse } from "../../../../utils/createResponse";
import prisma from "@/src/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        createResponse(false, "All fields are required", null),
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        createResponse(false, "Password must be at least 8 characters", null),
        { status: 400 },
      );
    }

    const isExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isExist) {
      return NextResponse.json(
        createResponse(false, "Email already registered", null),
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return NextResponse.json(
      createResponse(true, "User registered successfully", {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      createResponse(false, "Internal server error", null),
      { status: 500 },
    );
  }
}
