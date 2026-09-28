export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/8x2bJ1aIp7eH3oodf8eME00";

export function goToPayment() {
  window.location.href = STRIPE_PAYMENT_LINK;
}
