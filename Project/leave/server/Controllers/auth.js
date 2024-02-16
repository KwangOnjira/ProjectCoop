const dbSeq = require("../Config/index");
const { users } = dbSeq;
dbSeq.sequelize.sync();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.register = async (req, res) => {
  const {
    citizenID,
    prefix,
    name,
    surname,
    role,
    email,
    phone,
    divisionName,
    sub_division,
    position,
    password,
    birthday,
    type_of_employee,
    start_of_work_on,
    number_year_in_work,
    who_inspector,
    who_first_supeior,
    who_second_supeior,
  } = req.body;

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  try {

    info = await users.create({
      citizenID,
      prefix,
      name,
      surname,
      role,
      email,
      phone,
      divisionName,
      sub_division,
      position,
      password: hashedPassword,
      birthday,
      type_of_employee,
      start_of_work_on,
      number_year_in_work,
      who_inspector,
      who_first_supeior,
      who_second_supeior,
    });
    res.status(201).json(info);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { citizenID, password } = req.body;
    const user = await dbSeq.users.findOne({
      where: { citizenID },
    });
    if (!user) {
      return res.status(404).json("CitizenID not found");
    }

    //verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json("Incorrect citizenID and password combination");
    }

    //Authenticate
    const token = jwt.sign({ userId: user.citizenID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(token);

    res.status(200).send({
      name: user.name,
      citizenID: user.citizenID,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Sign in error");
  }
};

exports.currentUser = async(req,res) => {
  const userId = req.userId;
  try {
    const user = await dbSeq.users.findOne({
      attributes:{exclude:['password']},
      where: { citizenID: userId }
    })
    console.log('currentUser',user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error")
  }

}

exports.getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await dbSeq.users.findOne({
      where: { citizenID: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Details" });
  }
}

exports.profile = async (req, res) => {
  const userId = req.userId;
  const {
    citizenID,
    prefix,
    name,
    surname,
    role,
    email,
    phone,
    divisionName,
    sub_division,
    position,
    password,
    birthday,
    type_of_employee,
    start_of_work_on,
    number_year_in_work,
    who_inspector,
    who_first_supeior,
    who_second_supeior,
  } = req.body;

  try {
    const [rowsUpdated, [updatedUser]] = await dbSeq.users.update(
      {
        citizenID,
        prefix,
        name,
        surname,
        role,
        email,
        phone,
        divisionName,
        sub_division,
        position,
        password,
        birthday,
        type_of_employee,
        start_of_work_on,
        number_year_in_work,
        who_inspector,
        who_first_supeior,
        who_second_supeior,
      },
      {
      where: { citizenID: userId },
      returning: true,
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

