# Stripe Charge API

This is a [stdlib](https://stdlib.com) service that handles Stripe charges. You can create server-less landing pages that have payment functionality in minutes!

## Example

You can find a working example [here](https://nemo.github.com/stripe-f). It's using a Stripe test environment, so you can use one of their [test credit cards](https://stripe.com/docs/testing#cards): `4242 4242 4242 4242`.

## Usage

### stdlib Setup

#### Install function
```bash
lib get nemo/stripe
```

If you don't have [stdlib](https://stdlib.com) installed or want to learn about it more, see the repository [here](https://github.com/poly/stdlib).

#### Edit environment

You can set your Stripe API keys, amount to charge and the description of the charge using the environment variables in `env.json`. You can start by using the example one [here](/blob/master/env.json-example).

Here are the environment variables:

| Key | Description |
| --- | ----------- |
| STRIPE_API_KEY | API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys). |
| AMOUNT | Amount to charge. This is set here for security reasons. It has to be in cents. |
| CHARGE_DESCRIPTION | Text that shows up on the credit card statement |
| REDIRECT_URL | charge_checkout only – url to redirect to after successful or failed payment |
| REDIRECT_TIMEOUT | charge_checkout only – timeout in seconds to wait on the success / failure page before redirecting |

#### Launching service

You can push the service with your edited environment to the cloud using `lib up`. Read more about it [here](https://github.com/poly/stdlib#pushing-to-the-cloud).

#### Using Stripe Checkout

The service is built to be used alongside Stripe Checkout without any modifications. However, if you'd like to avoid a redirect from the service then you can customize the Checkout button to avoid it.

#### Stripe Checkout

You can use the vanilla Stripe Checkout system out of the box with the `charge_checkout` endpoint. You can put the URL of the `charge_checkout` endpoint in the `action` parameter of the form:

```html
    <form action="https://f.stdlib.com/nemo/stripe@dev/charge_checkout" method="POST">
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

##### Successful Payment
On a successful payment, a redirect will be made with `REDIRECT_URL` as the destination after `REDIRECT_TIMEOUT` seconds. If no `REDIRECT_TIMEOUT` is provided, the redirect is instantaneous.

`REDIRECT_URL` will have a `payment_success=true` appended to its query parameters.

##### Failed Payment
On a failed payment, a redirect will be made with `REDIRECT_URL` as the destination after `REDIRECT_TIMEOUT` seconds. If no `REDIRECT_TIMEOUT` is provided, the redirect is instantaneous.

`REDIRECT_URL` will have `payment_failure=true` and `payment_error=<error-message>` appended to its query parameters.

#### Custom

### Stripe button

If you want to make any major changes, please make a [fork](#fork-destination-box).

## Documentation
### /stripe/charge
[function spec](/blob/master/f/charge/function.json) | [source](/blob/master/f/charge/index.js)


### /stripe/charge_checkout
[function spec](/blob/master/f/charge_checkout/function.json) | [source](/blob/master/f/charge_checkout/index.js)
