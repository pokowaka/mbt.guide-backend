var mongoose = require('mongoose')

module.exports = function() {
  var Types = mongoose.Schema.Types

  var Model = {
    Schema: {
      rank: {
        type: Types.Number,
        required: true,
        default: 6,
        min: 1,
        max: 11
      }
    },
    modelName: 'segment_tag'
  }

  return Model
}
