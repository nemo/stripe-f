# Stripe Charge API

This is a [stdlib](https://stdlib.com) service that handles Stripe charges. You can create server-less landing pages that have payment functionality in minutes!

There are currently two functions: `charge` (JSON response) and `charge_checkout` (form input and HTML response).

Pull requests are welcome for any additions or bug fixes.

## Example

You can find a working example [here](https://nemo.github.com/stripe-f). It's using a Stripe test environment, so you can use one of their [test credit cards](https://stripe.com/docs/testing#cards): `4242 4242 4242 4242`.

## Usage

The service is built to be used alongside Stripe Checkout without any modifications. However, if you'd like to avoid a redirect from the service then you can customize the Checkout button to avoid it.

### Stripe Checkout (with redirect)

You can use the vanilla Stripe Checkout system out of the box with the `charge_checkout` endpoint. You can put the URL of the `charge_checkout` endpoint in the `action` parameter of the form:

There are a few hidden inputs that need to be set for the function:

- `redirect-url`: Url to redirect to after successful or failed payment
- `redirect-timeout`: Timeout in seconds to wait on the success / failure page before redirecting
- `amount`: Amount to charge. This is set here for security reasons. It has to be in cents.
- `charge-description`: Text that shows up on the credit card statement.
- `api-key`: Secret API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys). Note, this is VERY discouraged and is here to make it easy to test the service. You should read the security section of this document and include your Stripe API key as an environment variable on a copy of the service.

Here's a full example:

```html
    <form action="https://f.stdlib.com/nemo/stripe@dev/charge_checkout" method="POST">
        <input type="hidden" value="https://nemo.github.io/stripe-f/" name="redirect-url" />
        <input type="hidden" name="redirect-timeout" value="10" />
        <input type="hidden" name="amount" value="999" />
        <input type="hidden" name="charge-description" value="Test Payment" />
        <input type="hidden" name="api-key" value="stripe-api-key" />
        <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="stripe-api-key"
            data-amount="999"
            data-name="Name"
            data-shipping-address="true"
            data-billing-address="true"
            data-description="Widget"
            data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
            data-locale="auto">
          </script>
    </form>
```

#### Successful Payment
On a successful payment, a redirect will be made with `redirect-url` as the destination after `redirect-timeout` seconds. If no `redirect-timeout` is provided, the redirect is instantaneous.

`redirect-url` will have a `payment_success=true` appended to its query parameters.

#### Failed Payment
On a failed payment, a redirect will be made with `redirect-url` as the destination after `redirect-timeout` seconds. If no `redirect-timeout` is provided, the redirect is instantaneous.

`redirect-url` will have `payment_failure=true` and `payment_error=<error-message>` appended to its query parameters.


### Customized Stripe Checkout

In order to avoid the redirect, you can use the <a href="https://github.com/poly/f">f</a> library to call the function after Stripe has generated the card token from the user.

Here's a full example:

```html
<button id="customButton" class="btn btn-primary">Pay with Card</button>
<p id="custom-payment-status"></p>
<script>
    var handler = StripeCheckout.configure({
      key: 'pk_test_Wde01TzOa2lCe3mGBRuRxBOQ',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token, args) {
          console.log("got token", token, args);
          var params = {
              stripeToken: token.id,
              stripeEmail: token.email,
              amount: 999,
              // Note: this is highly discouraged, you can do this using environment variables
              "api-key": "sk_test_ffQOJwoAxcJLfTCS0TK2lURS",
              "charge-description": "Test payment"
          };

          if (args && args.shipping_name && args.shipping_name.length) {
              params.stripeShippingName = args.shipping_name;
              params.stripeShippingAddressLine1 = args.shipping_address_line1;
              params.stripeShippingAddressZip = args.shipping_address_zip;
              params.stripeShippingAddressState = args.shipping_address_state;
              params.stripeShippingAddressCity = args.shipping_address_city;
              params.stripeShippingAddressCountry = args.shipping_address_country;
          }

          if (args && args.billing_name && args.billing_name.length) {
              params.stripeBillingName = args.billing_name;
              params.stripeBillingAddressLine1 = args.billing_address_line1;
              params.stripeBillingAddressZip = args.billing_address_zip;
              params.stripeBillingAddressState = args.billing_address_state;
              params.stripeBillingAddressCity = args.billing_address_city;
              params.stripeBillingAddressCountry = args.billing_address_country;
          }

          console.log("f", params);
          f("nemo/stripe/charge@dev")(params, function(err, result) {
              if (err) $("#custom-payment-status").html("Payment failed: " + err);
              else $("#custom-payment-status").html("Payment Successful!");
          });
      }
    });

    document.getElementById('customButton').addEventListener('click', function(e) {
      // Open Checkout with further options:
      handler.open({
        name: 'Nima Gardideh',
        description: 'Widget',
        shippingAddress: true,
        billingAddress: true,
        amount: 999
      });
      e.preventDefault();
    });

    // Close Checkout on page navigation:
    window.addEventListener('popstate', function() {
      handler.close();
    });
</script>
```

### Security

If you don't want to expose your keys and want to make sure users can't change the amount of the charge on the form, then I recommend making a fork of this service and using the environment variables below. This is *absolutely required* for a production environment.

Fork this repository to and add an `env.json` file - you can start by using the example one [here](https://github.com/nemo/stripe-f//blob/master/env.json-example).

Here are the environment variables:

| Key | Description |
| --- | ----------- |
| STRIPE_API_KEY | API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys). |
| AMOUNT | Amount to charge. This is set here for security reasons. It has to be in cents. |
| CHARGE_DESCRIPTION | Text that shows up on the credit card statement |
| REDIRECT_URL | charge_checkout only – url to redirect to after successful or failed payment |
| REDIRECT_TIMEOUT | charge_checkout only – timeout in seconds to wait on the success / failure page before redirecting |

As added security, I also recommend setting `Access-Control-Allow-Origin` in the `function.json` files of this service to your domain.

#### Using Stripe Checkout

The service is built to be used alongside Stripe Checkout without any modifications. However, if you'd like to avoid a redirect from the service then you can customize the Checkout button to avoid it.

### Stripe Checkout (without redirect)

## Functions
### /stripe/charge
[function spec](https://github.com/nemo/stripe-f//blob/master/f/charge/function.json) | [source](https://github.com/nemo/stripe-f//blob/master/f/charge/index.js)

This function will create a charge for the given token with a JSON response. It also only accepts JSON input.

### /stripe/charge_checkout
[function spec](https://github.com/nemo/stripe-f//blob/master/f/charge_checkout/function.json) | [source](https://github.com/nemo/stripe-f//blob/master/f/charge_checkout/index.js)

This function is a wrapper around the charge function to accept `application/x-www-form-urlencoded` inputs and respond with an HTML page to redirect back to a desired success / failure page.
