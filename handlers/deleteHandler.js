module.exports.deleteHandler = function (database, request, response) {
    const {id} = request.body;
    database.destroy({where: {id}}).then(() => response.json('Deleted!'));
};

