import { stripe } from "@/lib/stripeConfig";
import type Stripe from 'stripe';
type AllowedApiVersion = Stripe.StripeConfig['apiVersion'] | '2022-11-15';
