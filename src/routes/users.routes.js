import { Router } from "express";
import { createToken } from "../utils/index.js";
import passport from "passport";

import { hashPassword, comparePassword } from "../utils/hash.js";
import User from "../models/user.model.js";
const router = Router();

// Current
router.get("/current",passport.authenticate("jwt", { session: false }),(req, res) => {
        res.send(req.user);
    }
);

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await comparePassword(password, userFound.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = { id: userFound._id, first_name: userFound.first_name, last_name: userFound.last_name, email: userFound.email, age: userFound.age, role: userFound.role } ;

    let token = createToken(user, "8h");

    res
      .cookie("authCookie", token, { maxAge: 60 * 60 * 1000, httpOnly:true})
      .send({message:'LOGIN EXITOSO'});

  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
});


// Register
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password || !cart || !role) return res.status(400).json({ error: 'Faltan campos requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    const hashed = await hashPassword(password);
    const user = await User.create({ first_name, last_name, email, age, password: hashed, cart, role });
    ///const token = signToken({ sub: user._id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'Usuario creado',
      user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, age: user.age, cart: user.cart, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ error: 'Error en registro' });
  }
});

export default router;

