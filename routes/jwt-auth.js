require("dotenv").config();
const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isDuplicateEmailError = (err) => {
  return err && (err.code === "ER_DUP_ENTRY" || err.errno === 1062);
};

router.post("/register", async (req, res) => {
  const { username, email, team, password } = req.body;
  
  if (!username || !email || !team || !password) {
    return res.status(400).send("Please enter the required fields.");
  }

  try {
    const userExists = await knex("user").where({ email });

    if (userExists.length !== 0) {
      return res.status(409).send("User with that email already exists.");
    }

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = {
      username,
      email,
      team,
      password: hashedPassword,
    };

    await knex("user").insert(newUser);

    return res.status(200).send("Registered successfully");
  } catch (err) {
    if (isDuplicateEmailError(err)) {
      return res.status(409).send("User with that email already exists.");
    }

    console.log(err);
    return res.status(400).send("Failed registration");
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter the required fields");
  }

  // Fetch the user by email
  knex("user")
    .where({ email: email })
    .first()
    .then((user) => {
      // If no email in DB, respond with 400
      if (!user) {
        return res.status(400).send("Invalid email");
      }

      // Validate the password
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).send("Invalid password");
      }

      // Sign the token and send to the user
      // 1: payload
      // 2: secret
      // 3: config (optional)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SESSION_SECRET,
        { expiresIn: "5m" }
      );

      res.status(200).json({ token: token });
    })
    .catch((err) => {
      res.status(400).send("Couldnt log you in");
    });
});

router.get("/current", (req, res) => {
  // If there is no auth header provided
  if (!req.headers.authorization) {
    return res.status(401).send("Please include your JWT");
  }

  // Parse the bearer token
  const authHeader = req.headers.authorization;
  const [scheme, authToken] = authHeader.split(" ");

  if (scheme !== "Bearer" || !authToken) {
    return res.status(401).send("Invalid auth token");
  }

  jwt.verify(authToken, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid auth token");
    }

    knex("user")
      .where({ id: decoded.id })
      .first()
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }

        delete user.password;
        return res.json(user);
      })
      .catch(() => {
        res.status(500).send("Cant fetch user info");
      });
  });
});

module.exports = router;
