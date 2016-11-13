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

#### Edit environment
You can set your Stripe API keys, amount to charge and the description of the charge using the environment variables in `env.json`. You can start by using the example one [here](/blob/master/env.json-example).

Here are the environment variables:

| Key | Description |
| --- | ----------- |
| STRIPE_API_KEY | API key from Stripe. You can get them [here](https://dashboard.stripe.com/account/apikeys). |
| AMOUNT | Amount to charge. This is set here for security reasons. It has to be in cents. |
| CHARGE_DESCRIPTION | Text that shows up on the credit card statement |

### Stripe button

If you want to make any major changes, please make a [fork](#fork-destination-box).

### Documentation
### /stripe/charge
[function spec](/blob/master/f/charge/function.json) | [source](/blob/master/f/charge/index.js)


### /stripe/charge_checkout
[function spec](/blob/master/f/charge_checkout/function.json) | [source](/blob/master/f/charge_checkout/index.js)
