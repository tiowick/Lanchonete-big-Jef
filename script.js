const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// abrir a modal de carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex"; // tira a hidden da nodal
});

//fechar a modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//fecha a modal no botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let paranButton = event.target.closest(".add-to-cart-btn");
  if (paranButton) {
    const name = paranButton.getAttribute("data-name");
    const price = parseFloat(paranButton.getAttribute("data-price"));

    // adicionar no carrinho

    addTocart(name, price);
  }
});

// função pra add no carrinho
function addTocart(name, price) {
  const isExist = cart.find((item) => item.name === name);
  if (isExist) {
    // se o item existir adiciona +1
    isExist.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//atualiza carrinho

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
                    <p class="font-Bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

            
                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
                
            </div>
        
        `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

//remover o item do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

//

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.inputValue;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// finalizar o carrinho
checkoutBtn.addEventListener("click", function(){
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
   Toastify({
     text: "Olá, no momento estamos fechados!",
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
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}`;
    })
    .join(" | ");

  const message = encodeURIComponent(
    `Pedido:${cartItems} Endereço: ${addressInput.value}`
  );
  const phone = "71981859864";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = []; // limpando o carrinho
  updateCartModal();
});

// manipular a hora e o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 19 && hora < 22; // aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
