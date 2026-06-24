const userModel = require("../Model/User");

const getUsersProfile = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      total_users: users.length,
      status: "Success",
      message: "Users are fetched successfully",
      users,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

//get a single user
const getSingleUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const userExistence = await userModel.findById(userId);

    if (!userExistence)
      return res.status(404).json({
        status: "Failed",
        message: "user does not exist in Record",
      });

    const user = {
      id: userExistence._id,
      username: userExistence.username,
      role: userExistence.role,
      email: userExistence.email,
    };

    res.status(200).json({
      status: "success",
      message: "User found",
      user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
//update user profile
const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, username, role } = req.body;

    const allowedRoles = ["Staff", "Admin", "Manager"];
    if (!allowedRoles.includes(role))
      return res
        .status("400")
        .json({ status: "failed", message: "Role you entered is not allowed" });
    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        { email, username, role },
        { returnDocument: "after" },
      )
      .select("-password");

    if (!updatedUser)
      return res.status(404).json({
        status: "failed",
        message: "The user is not found",
      });

    res.status(200).json({
      status: "success",
      message: "Updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

//delete user profile
const deleteUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({
        status: "failed",
        message: "user does not exist in DB",
      });

    res.status(200).json({
      status: "success",
      message: "User is deleted ",
      deletedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

/**
 * In ORder to authenticate user that login
 */

  const getMe = async(req, res)=>{
    try{
      const user = await userModel.findOne({email: req.userInfo.email}).select('-password')
      console.log(user)
      if(!user) return res.status(404).json({status: "failed", message: "user not found"})
        res.status(200).json({
      status:"success",
      message: "user fetched",
      user
    })

    }catch(e){
      console.error(e)
      res.status(500).json({
        status: "failed",
        message: "Something went wrong"
      })
    }
  }

module.exports = {
  getUsersProfile,
  getSingleUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getMe
};
