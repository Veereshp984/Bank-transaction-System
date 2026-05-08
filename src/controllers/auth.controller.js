const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
/**
 * - user register controller
 * - POST /api/auth/register
 */
const userRegisterController = async (req, res) => {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });
  if (isExist) {
    return res.status(422).json({
      message: "User already exists with Email",
      status: "failed",
    });
  }
  const user = await userModel.create({
    email,
    password,
    name,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  res.cookie("token" , token)

  res.status(201).json({
    user:{
        _id:user.id,
        email:user.email,
        name:user.name
    },
    token
  })
};
// user login TaskController
// POST  /api/auth/

const userLoginController = async (req, res) =>{
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message : "Email or password is INVALID"
        })
    }
    const isValidpassword = await user.comparePassword(password)
    if(!isValidpassword){
       return res.status(401).json({
            message : "Email or password is INVALID"
        })
    }
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  res.cookie("token" , token)

  res.status(200).json({
    user:{
        _id:user.id,
        email:user.email,
        name:user.name
    },
    token
  })
   
}

module.exports = {
  userRegisterController,
  userLoginController
};
