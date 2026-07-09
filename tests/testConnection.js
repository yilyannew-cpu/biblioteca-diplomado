const sequelize = require("../config/database");
async function conectar() {
try {
    await sequelize.authenticate();
    console.log("Conexión exitosa.");
} catch(error) {
    console.error(error);
}
}
conectar();