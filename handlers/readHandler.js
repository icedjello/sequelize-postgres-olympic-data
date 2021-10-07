const {Op} = require("sequelize");
const {getFilteringAndArray} = require("../helper_functions/getFilteringAndArray");
const {getSortingOrder} = require("../helper_functions/getSortingOrder");


module.exports.readHandler = function (database, request, response) {
    const {startRow, endRow, rowGroupCols, groupKeys, filterModel, sortModel} = request.body;
    let options = {
        offset: startRow,
        limit: endRow,
        where: {
            [Op.and]: []
        }
    };
    const AND_ARRAY = options.where[Op.and];
    // SORTING
    if (sortModel.length > 0) {
        options.order = getSortingOrder(sortModel);
    }

    // FILTERING
    if (Object.keys(filterModel).length > 0) {
        AND_ARRAY.push(getFilteringAndArray(filterModel));
    }

    // GROUPING
    if (rowGroupCols.length > 0) {
        const groupingColumnsLength = rowGroupCols.length;
        const groupKeysLength = groupKeys.length;
        if (groupKeysLength > 0) { // COMPLICATED
            // LEAF NODES EXPOSED
            if (groupingColumnsLength === groupKeysLength) {
                const allAttributes = ['id', 'athlete', 'age', 'country', 'sport', 'gold', 'silver', 'bronze'];
                let andArray = [];
                for (let i in groupKeys) {
                    andArray.push({
                        [rowGroupCols[i].field]: groupKeys[i]
                    });
                }
                andArray.forEach(it => AND_ARRAY.push(it));
                options.attributes = allAttributes;
            } else
                // GROUPS WITHIN GROUPS
            {
                function getAttributes() {
                    let result = [];
                    for (let i in rowGroupCols) {
                        i <= groupKeysLength ? result.push(rowGroupCols[i].field) : undefined;
                    }
                    return result;
                }

                const attributes = getAttributes();
                let andArray = [];
                for (let i in groupKeys) {
                    andArray.push({
                        [rowGroupCols[i].field]: groupKeys[i]
                    });
                }
                andArray.forEach(it => AND_ARRAY.push(it));
                options.attributes = attributes;
                options.group = attributes;
            }
        } else
            // ONLY GROUPING - NO CHILDREN OPEN
        {
            const firstGroupColumnField = [rowGroupCols[0].field];
            options.attributes = firstGroupColumnField;
            options.group = firstGroupColumnField;
        }
    }
    //-----------------------------------------------------
    console.log('OPTIONS',options);
    database.findAndCountAll(options)
        .then(dataAndCount => {
            if (Array.isArray(dataAndCount.count)) {
                dataAndCount.count = dataAndCount.count.length;
            }
            response.json(dataAndCount);
        });
};
