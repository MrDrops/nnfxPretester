//Configuration of the database

const env = process.env;
//db config
const config = {
    db: {
    host : env.DB_HOST || 'localhost',
    user : env.DB_SER || 'root',
    password : env.DB_PASS || 'Erase una vez un rey',
    database : env.DB_DATABASE || 'nnfx-pretester',
    }
};

module.exports = config;