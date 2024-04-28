const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// to open the cart modal
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// to close the cart modal by clicking outside
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// to close the cart modal by clicking the close button
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (e) => {
  let parentBtn = e.target.closest(".add-to-cart-btn");

  if (parentBtn) {
    const name = parentBtn.getAttribute("data-name");
    const price = parseFloat(parentBtn.getAttribute("data-price"));

    // add items to shopping cart
    addToCart(name, price);
  }
});

// function to add items to cart
function addToCart(name, price) {
  const existingItem = cart.find((i) => i.name === name);

  if (existingItem) {
    existingItem.qtt += 1;
  } else {
    cart.push({
      name,
      price,
      qtt: 1,
    });
  }

  updateCartModal();
}

//update the modal
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
          <div>
               <p class="font-bold italic text-red-600">${item.name}</p>
               <p>Quant: ${item.qtt}</p>
               <p class="font-medium mt-3">R$ ${item.price.toFixed(2)}</p>
          </div>
          <button class="remove-btn" data-name="${item.name}">
               Remover
          </button>
     </div>
    `;

    total += item.price * item.qtt;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

//function to remove item added to cart
cartItemsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const name = e.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.qtt > 1) {
      item.qtt -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-600");
    addressWarn.classList.add("hidden");
  }
});

//finalize the order
checkoutBtn.addEventListener("click", () => {
  const isOpen = checkOpen();
  if (!isOpen) {
    Toastify({
      text: "Não atendemos este horario, Pedidos das 19:00 até as 23:00",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-600");
    return;
  }

  //send request to whatsapp api
  const cartItems = cart
    .map((i) => {
      return `${i.name} Quantidade: (${i.qtt}) Preço: R$ ${i.price} | `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phoneNumber = "13974010503";

  window.open(
    `https://wa.me/${phoneNumber}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];
  addressInput.value = "";

  updateCartModal();
});

//Check the time and manipulate the time card.
function checkOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 19 && hora < 22;
  // true = the restaurant is open
}

const spanItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-600", "text-white");
  spanItem.classList.add("bg-green-400", "text-zinc-800");
} else {
  spanItem.classList.add("bg-red-600", "text-white");
  spanItem.classList.remove("bg-green-400", "text-zinc-800");
}
