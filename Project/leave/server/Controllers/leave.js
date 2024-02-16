const dbSeq = require("../Config/index");
const {
  leave,
} = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
const { lastStatistic } = require("./statistic");
dotenv.config({ path: "./.env" });

exports.getLeave = async (req, res) => {
  const userId = req.userId;
  info = await leave.findAll({ where: { citizenID: userId } });
  res.json(info);
};

exports.getLeaveById = async (req, res) => {
  const userId = req.userId;
  const statid = req.params.statid;
  info = await leave.findOne({
    where: { citizenID: userId, statisticID: statid },
  });
  res.json(info);
};

async function createLeave(type, leaveDetails) {
  try {
    const createLeave = await dbSeq.leave.create({
      topic:leaveDetails.topic,
      type: leaveDetails.type,
      to: leaveDetails.to,
      date: leaveDetails.date,
      contact: leaveDetails.contact,
      firstDay: leaveDetails.firstDay,
      lastDay: leaveDetails.lastDay,
      numDay: leaveDetails.numDay,
      status: leaveDetails.status,
      allow: leaveDetails.allow,
      comment: leaveDetails.comment,
      typeCount: leaveDetails.typeCount,
      citizenID: leaveDetails.citizenID,
      statisticID: leaveDetails.statisticID,
    });

    switch (type) {
      case "sickleave":
        await dbSeq.sickleave.create({
          leaveID: createLeave.leaveID,
          reason: leaveDetails.reason,
        });
        break;

      case "personalleave":
        await dbSeq.personalleave.create({
          leaveID: createLeave.leaveID,
          reason: leaveDetails.reason,
        });
        break;

      case "vacationleave":
        await dbSeq.vacationleave.create({
          leaveID: createLeave.leaveID,
          deputyName: leaveDetails.deputyName,
        });
        break;

      case "maternityleave":
        await dbSeq.maternityleave.create({
          leaveID: createLeave.leaveID,
        });
        break;

      case "ordinationleave":
        await dbSeq.ordinationleave.create({
          leaveID: createLeave.leaveID,
          level: leaveDetails.level,
          useTo: leaveDetails.useTo,
          nameTemple: leaveDetails.nameTemple,
          addressTemple: leaveDetails.addressTemple,
          dateOrdi: leaveDetails.dateOrdi,
          stayTemple: leaveDetails.stayTemple,
          addressStayTemple: leaveDetails.addressStayTemple,
        });
        break;

      case "studyleave":
        await dbSeq.studyleave.create({
          leaveID: createLeave.leaveID,
          level: leaveDetails.level,
          salaryNumber: leaveDetails.salaryNumber,
          salaryAlphabet: leaveDetails.salaryAlphabet,
          typeStudy: leaveDetails.typeStudy,
          subject: leaveDetails.subject,
          degree: leaveDetails.degree,
          academy: leaveDetails.academy,
          countrystudy: leaveDetails.countrystudy,
          scholarshipstudy: leaveDetails.scholarshipstudy,
          course: leaveDetails.course,
          address: leaveDetails.address,
          countrytrain: leaveDetails.countrytrain,
          scholartrain: leaveDetails.scholartrain,
        });
        break;

      default:
        console.error("Invalid leave type");
        return null;
    }

    console.log(`Leave with type '${type}' created successfully`);
    return createLeave;
  } catch (error) {
    console.error("Error creating leave:", error);
    return null;
  }
}

exports.leave = async (req, res) => {
  const last = await lastStatistic(req, res);
  const type = req.params.type;
  const {
    citizenID,
    statisticID,
    topic,
    to,
    date,
    contact,
    firstDay,
    lastDay,
    numDay,
    status,
    allow,
    comment,
    typeCount,
    reason,
    deputyName,
    useTo,
    nameTemple,
    addressTemple,
    dateOrdi,
    stayTemple,
    addressStayTemple,
    level,
    salaryNumber,
    salaryAlphabet,
    typeStudy,
    subject,
    degree,
    academy,
    countrystudy,
    scholarshipstudy,
    course,
    address,
    countrytrain,
    scholartrain,
  } = req.body;

  try {
    console.log("start create");
    const leavedetail = await createLeave(type, {

      citizenID,
      statisticID: last,
      type:type,
      topic,
      to,
      date,
      contact,
      firstDay,
      lastDay,
      numDay,
      status,
      allow,
      comment,
      typeCount,
      reason,
      deputyName,
      useTo,
      nameTemple,
      addressTemple,
      dateOrdi,
      stayTemple,
      addressStayTemple,
      level,
      salaryNumber,
      salaryAlphabet,
      typeStudy,
      subject,
      degree,
      academy,
      countrystudy,
      scholarshipstudy,
      course,
      address,
      countrytrain,
      scholartrain,
    });
    console.log(leavedetail)
    res.status(201).json(leavedetail);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};
