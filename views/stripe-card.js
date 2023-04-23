const stripe = Stripe(
  "pk_test_51MzstSEA1cQIWhWCMU1fWyTMIiiiGGdobVpiWK7HY85rPU5MIgQqwQvd46T49WiWr20TK7bi2NS0so9QwmHKQcvX00meK63mLs"
);
const elements = stripe.elements();

let style = {
  base: {
    color: "#000",
  },
};

const card = elements.create("card", { style });
card.mount("#card-element");

const form = document.querySelector("form");
const errorEl = document.querySelector("#card-errors");

// Give our token to our form
const stripeTokenHandler = (token) => {
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  form.appendChild(hiddenInput);

  form.submit();
};

// Create token from card data
form.addEventListener("submit", (e) => {
  e.preventDefault();

  stripe.createToken(card).then((res) => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  });
});
