import { Hono } from 'hono';
import  prisma  from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'stysydgdgfdgfd';
app.post('/sign-up', async (c) => {
  try {
    const { fullName, email, password } = await c.req.json();

    if (!fullName || !email || !password) {
      return c.json({ message: 'All fields are required' }, 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return c.json({ message: 'Email already registered' }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      message: 'User created successfully',
      token,
      user: { id: user.id, fullName: user.name, email: user.email },
    }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ message: 'Error occurred while signing up.' }, 500);
  }
});

// ✅ SIGN-IN Route
app.post('/sign-in', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ message: 'Email and password are required.' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return c.json({ message: 'Invalid email or password.' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return c.json({ message: 'Invalid email or password.' }, 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      message: 'Login successful',
      token,
      user: { id: user.id, fullName: user.name, email: user.email },
    }, 200);
  } catch (err) {
    console.error('Error during sign-in:', err);
    return c.json({ message: 'Error occurred while signing in.' }, 500);
  }
});

export default app;
