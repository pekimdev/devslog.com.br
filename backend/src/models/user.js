async function findOneByUsername(username) {
  try {
    const row = await database.Users.findOne({
      where: { username: username },
    });
    if (!row) {
      throw new Error({
        message: "User not found",
      });
    }
    return row;
  } catch (err) {
    throw new Error({
      message: err.message,
    });
  }
}
