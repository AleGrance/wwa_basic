module.exports = (sequelize, DataType) => {

    const Roles = sequelize.define('Roles', {
        role_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: DataType.STRING,
            allowNull: false
        }
    });

    Roles.associate = (models) => {
        Roles.hasMany(models.Users, {
            foreignKey: {
                name: 'role_id',
                allowNull: false
            }
        });
    };

    return Roles;
};