/* CREATE */
const createToken = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

/* READ */

/* UPDATE */

/* DELETE */

module.exports = {
  createToken,
  refreshToken,
};
