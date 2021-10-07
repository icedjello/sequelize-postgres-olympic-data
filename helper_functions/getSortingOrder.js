module.exports.getSortingOrder = function (sortModel) {
    let order = [];
    for (let sort of sortModel) {
        const direction = sort.sort.toUpperCase();
        order.push([sort['colId'], direction]); // [column, direction]
    }
    return order;
}
