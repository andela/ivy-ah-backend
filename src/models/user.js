module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      field: 'user_name',
    },
    firstname: {
      type: DataTypes.STRING(255),
      field: 'first_name',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user', 'guest'],
      defaultValue: 'user',
    },
    lastname: {
      type: DataTypes.STRING(255),
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
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
  // users.associate = (models) => {
  //   users.hasMany(models.articles);
  // };
  return users;
};
