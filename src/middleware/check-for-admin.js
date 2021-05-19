const CheckForAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== "Admin") {
    return res.status(401).json({ message: "Admin Only Can Access This" });
  }

  next();
};
export default CheckForAdmin;
