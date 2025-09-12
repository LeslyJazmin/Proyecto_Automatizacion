export const login = (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({ status: "ok", token: "abc123" });
  }

  return res.status(401).json({ status: "error", message: "Credenciales incorrectas" });
};
