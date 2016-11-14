# Stripe Charge API

This is a [stdlib](https://stdlib.com) service that handles Stripe charges. You can create server-less landing pages that have payment functionality in minutes!

If you want to make any major changes, please make a [fork](#fork-destination-box).

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
- `api-key`: API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys).

Here's a full example:

```html
    <form action="https://f.stdlib.com/nemo/stripe@dev/charge_checkout" method="POST">
        <input type="hidden" value="https://nemo.github.io/stripe-f/" name="redirect-url" />
        <input type="hidden" value="10" name="redirect-timeout" />
        <input type="hidden" value="999" name="amount" />
        <input type="hidden" value="Test Payment" name="charge-description" />
        <input type="hidden" value="stripe-api-key" name="api-key" />
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


### Security

If you don't want to expose your keys and want to make sure users can't change the amount of the charge on the form, then I recommend making a fork of this service and using the environment variables below:

You can set your Stripe API keys, amount to charge and the description of the charge using the environment variables in `env.json` as well. You can start by using the example one [here](/blob/master/env.json-example).

Here are the environment variables:

| Key | Description |
| --- | ----------- |
| STRIPE_API_KEY | API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys). |
| AMOUNT | Amount to charge. This is set here for security reasons. It has to be in cents. |
| CHARGE_DESCRIPTION | Text that shows up on the credit card statement |
| REDIRECT_URL | charge_checkout only – url to redirect to after successful or failed payment |
| REDIRECT_TIMEOUT | charge_checkout only – timeout in seconds to wait on the success / failure page before redirecting |

#### Using Stripe Checkout

The service is built to be used alongside Stripe Checkout without any modifications. However, if you'd like to avoid a redirect from the service then you can customize the Checkout button to avoid it.


### Stripe Checkout (without redirect)

## Documentation
### /stripe/charge
[function spec](/blob/master/f/charge/function.json) | [source](/blob/master/f/charge/index.js)


### /stripe/charge_checkout
[function spec](/blob/master/f/charge_checkout/function.json) | [source](/blob/master/f/charge_checkout/index.js)
