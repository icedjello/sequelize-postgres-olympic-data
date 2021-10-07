const Sequelize = require("sequelize");
const {Op} = require("sequelize");
const {getFilteringAndArray} = require("../helper_functions/getFilteringAndArray");

module.exports.setFilterValuesHandler = function (database, request, response) {
    const {field, filterModel} = request.body;

    let options = {
        attributes: [Sequelize.fn('DISTINCT', Sequelize.col(field)), field],
        where: {
            [Op.and]: []
        }
    };

    if (Object.keys(filterModel).length > 0) {
        options.where[Op.and] = getFilteringAndArray(filterModel);
    }

    database.findAll(options).then(data => {
        const values = data.map(it => {
            const {dataValues} = it;
            return Object.values(dataValues)[0];
        });
        response.json(values);
    });
};
