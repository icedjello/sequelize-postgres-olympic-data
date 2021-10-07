module.exports.updateHandler = function (database, request, response) {
    const {id, updateData} = request.body;
    database.update(updateData, {where: {id}}).then(() => response.json('updated!'));
};


