module.exports = (sequelize, DataType) => {

    const Users = sequelize.define('Users', {
        user_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_name: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                msg: 'El user_name ingresado ya existe!',
                fields: ['user_name']
            },
            validate: {
                notEmpty: {
                    msg: 'El nombre de usuario no debe estar vacio!',
                    fields: ['user_name']
                }
            }
        },
        user_fullname: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre full de usuario no debe estar vacio!',
                    fields: ['user_fullname']
                }
            }
        },
        user_password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La no contraseña no debe estar vacia!',
                    fields: ['user_password']
                }
            }
        },
        user_email: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                msg: 'El correo ingresado ya existe',
                fields: ['user_email']
            },
            validate: {
                notEmpty: {
                    msg: 'El correo no debe estar vacio!',
                    fields: ['user_email']
                }
            }
        }
    });

    // Segundo los belongsTo
    Users.associate = (models) => {
        Users.belongsTo(models.Roles, {
            foreignKey: {
                name: 'role_id',
                allowNull: false
            }
        });
    };

    return Users;
};