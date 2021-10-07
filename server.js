const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const environment = require('./config/config.json').test;
app.use(express.json());

const cors = require("cors");
const {createHandler} = require("./handlers/createHandler");
const {deleteHandler} = require("./handlers/deleteHandler");
const {updateHandler} = require("./handlers/updateHandler");
const {readHandler} = require("./handlers/readHandler");
const {setFilterValuesHandler} = require("./handlers/setFilterValuesHandler");
app.use(cors());

const port = 3000;

const sequelize = new Sequelize(environment.database, environment.username, environment.password, {
    host: environment.host,
    dialect: environment.dialect,
    additional: {timeStamps: false}
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const Athlete = sequelize.define('athlete', {
    athlete: {type: Sequelize.STRING, allowNull: false},
    age: {type: Sequelize.INTEGER, allowNull: false},
    country: {type: Sequelize.STRING, allowNull: false},
    sport: {type: Sequelize.STRING, allowNull: false},
    gold: {type: Sequelize.INTEGER, allowNull: false},
    silver: {type: Sequelize.INTEGER, allowNull: false},
    bronze: {type: Sequelize.INTEGER, allowNull: false}
});
Athlete.sync({force: true})
    .then(() => {
        const rowData = require('./rowData/rowData');

        async function addDataToDB(rowData) {
            for (let row of rowData) {
                await Athlete.create(row);
            }
        }
        addDataToDB(rowData).then(() => {});
    });

app.listen(port, () => console.log(`example app listening on port http://localhost:${port}`));

app.post('/setFilterValues', (request, response) => setFilterValuesHandler(Athlete, request, response));

app.post('/create', (request, response) => createHandler(Athlete, request, response));

app.post('/read', (request, response) => readHandler(Athlete, request, response));

app.post('/update', (request, response) => updateHandler(Athlete, request, response));

app.post('/delete', (request, response) => deleteHandler(Athlete, request, response));


