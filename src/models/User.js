const user = (sequelize, DataTypes) => {
  const users = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(50),
      unique: {
        args: true,
        msg: 'username already in use!'
      },
      field: 'user_name',
    },
    firstname: {
      type: DataTypes.STRING(255),
      field: 'first_name',
    },
    lastname: {
      type: DataTypes.STRING(255),
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },
    password: {
      type: DataTypes.TEXT
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true

    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {});
  users.associate = (models) => {
    users.hasMany(models.articles);
    users.hasMany(models.following);
  };

  return users;
};

export default user;
