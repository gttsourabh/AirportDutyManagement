const mongoose = require('mongoose');

const terminalSchema = new mongoose.Schema(
  {
    airportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.airportId = ret.airportId?.toString ? ret.airportId.toString() : ret.airportId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Terminal', terminalSchema);
