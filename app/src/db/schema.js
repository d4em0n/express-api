const Joi = require('joi').extend(require('@joi/date'));;

const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  posisi: Joi.string()
    .min(3)
    .max(30)
    .required(),
  tanggalMasuk: Joi.date()
    .format("YYYY-MM-DD")
    .required(),
  email: Joi.string()
    .email()
    .required(),
  photo: Joi.any()
});

module.exports = schema;
