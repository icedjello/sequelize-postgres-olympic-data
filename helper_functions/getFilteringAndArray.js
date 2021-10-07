const {Op} = require("sequelize");

module.exports.getFilteringAndArray = function (filterModel) {
    const filterColumns = Object.keys(filterModel);
    let andArray = [];

    if (filterColumns.includes('athlete')) {
        andArray.push({
            athlete: {
                [Op.substring]: filterModel.athlete.filter
            }
        });
    }

    if (filterColumns.includes('country')) {
        andArray.push({
            country: {
                [Op.or]: filterModel.country.values
            }
        });
    }
    if (filterColumns.includes('sport')) {
        andArray.push({
            sport: {
                [Op.or]: filterModel.sport.values
            }
        });
    }

    Object.entries(filterModel).forEach(([columnName]) => {
        if (['age', 'gold', 'silver', 'bronze'].includes(columnName)) {
            const filterValue = filterModel[columnName].filter;
            const filterType = filterModel[columnName].type;
            const filterSign = filterType === "greaterThan" ? Op.gt : filterType === "lessThan" ? Op.lt : Op.eq;
            const query = {
                [columnName]: {
                    [filterSign]: filterValue
                }
            };
            andArray.push(query);
        }
    });
    return andArray;
};
