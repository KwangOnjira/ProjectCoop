module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      citizenID: {
        type: Sequelize.INTEGER(13),
        primaryKey: true,
        field: "citizenID",
      },
      prefix: {
        type: Sequelize.STRING(200),
        allowNull: false,
        field: "prefix",
      },
      name: { type: Sequelize.STRING(255), allowNull: false, field: "name" },
      surname: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "surname",
      },
      role: { type: Sequelize.STRING(255), allowNull: false, field: "role" ,default:'user'},
      email: { type: Sequelize.STRING(255), allowNull: false, field: "email" },
      phone: { type: Sequelize.STRING(10), allowNull: false, field: "phone" },
      divisionName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "divisionName",
      },
      sub_division: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "sub_division",
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
        field: "position",
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "password",
      },
      birthday: { type: Sequelize.DATE, allowNull: true, field: "birthday" },
      type_of_employee: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "type_of_employee",
      },
      start_of_work_on: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "start_of_work_on",
      },
      number_year_in_work: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "number_year_in_work",
      },
      who_inspector: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "who_inspector",
      },
      who_first_supeior: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "who_first_supeior",
      },
      who_second_supeior: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "who_second_supeior",
      },
    },
    {
      tableName: "users",
    }
  );

  return users;
};
