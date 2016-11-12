/* Import dependencies, declare constants */
var qs = require('qs');
var stripe = require("stripe")(process.env.STRIPE_API_KEY);
var amountToCharge = parseInt(process.env.AMOUNT);

module.exports = (params, callback) => {
    var token = params.kwargs.stripeToken;
    var email = params.kwargs.stripeEmail;
    var shipping = {
        name: params.kwargs.stripeShippingName,
        address: {
            line1: params.kwargs.stripeShippingAddressLine1,
            line2: params.kwargs.stripeShippingAddressLine2,
            postal_code: params.kwargs.stripeShippingAddressZip,
            state: params.kwargs.stripeShippingAddressState,
            city: params.kwargs.stripeShippingAddressCity,
            country: params.kwargs.stripeShippingAddressCountry,
        }
    };

    var chargeParams = {
      amount: amountToCharge, // Amount in cents
      currency: "usd",
      source: token,
      description: process.env.CHARGE_DESCRIPTION || "Example charge"
    };

    if (shipping && shipping.name.length)
        chargeParams.shipping = shipping;

    var charge = stripe.charges.create(chargeParams, function(err, charge) {
        return callback(err, {
            status: "ok",
            message: ((charge.outcome || {}).seller_message) || 'Payment completed.'
        });
    });
};
