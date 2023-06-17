const models = require('../../config/dbConnection').models;
const sequelize = require('../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');

const verifyUser = async (req, res, next) => {
  const userid =
    req.body.UserId || req.query.UserId;

  if (!userid) {
    const resobj = {
      status: "success",
      result: "A UserId is required for authentication"
    }
    return res.status(403).send(resobj);
  }
  try {
    const userData = await models.tbl_users.findAll({
      where: {
        UserID: userid
      }
    });

    if (userData.length <= 0) {
      const resobj = {
        status: "success",
        result: "User Not Found"
      }
      return res.status(200).send(resobj);
    }
    else {
      if (userData.active != 1 && (userData.source != "ids" || userData.source == "undefined")) {
        const resobj = {
          status: "success",
          result: "User is not loggedin"
        }
        return res.status(200).send(resobj);
      }
    }
    console.log(userData);
  } catch (err) {
    const resobj = {
      status: "success",
      result: "request connot be completed"
    }
    return res.status(403).send(resobj);
  }
  return next();
};

module.exports = verifyUser;