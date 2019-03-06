var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    response: function(status, message, data) {
        return {
            status: status || 0,
            message: message || 'Something is wrong!!',
            data: data || null
        };
    },

    validataObjectId: function(id) {
        if (ObjectId.isValid(id)) {
            var obj = new ObjectId(id);
            if (obj = id) {
                return true;
            }
        }
        return false;
    },
}