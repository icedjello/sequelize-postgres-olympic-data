module.exports.createHandler = function(database, request, response) {
    const {athlete, age, country, sport, gold, silver, bronze} = request.body;
    database.create({athlete, age, country, sport, gold, silver, bronze}).then(() => response.json('New row added!'));
}

