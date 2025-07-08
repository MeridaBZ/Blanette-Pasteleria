document.addEventListener('DOMContentLoaded', () => {
  // -- MENU HAMBURGUESA -- 
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  } else {
    console.warn('menu-toggle o nav-links no encontrados en el DOM');
  }



  // -- PRODUCTOS Y RECETAS -- 
  const productosContainer = document.querySelector('.products-container');
  const recetasContainer = document.querySelector('.recetas-container');

  const promosContainer = document.querySelector('.promos-container');
  const recetariosIndexContainer = document.querySelector('.recetarios-container');

  const formatoPrecio = (precio) => {
    return precio.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    });
  };

  function renderProductos(productos) {
    productosContainer.innerHTML = '';
    productos.forEach(producto => {
      const { id, title, price, originalPrice, discount, image } = producto;
      productosContainer.innerHTML += `
        <article class="products" data-id="${id}">
          <div class="imgBox">
            <img src="${image}" alt="${title}" class="itemOferta" />
          </div>
          <div class="DatosBox">
            <h4>${title}</h4>
            <div class="descard">
              ${originalPrice && discount ? `
                <small>${formatoPrecio(originalPrice)}</small>
                <h4>${discount}%</h4>
              ` : ''}
            </div>
            <h2 class="price">${formatoPrecio(price)}</h2>
            <a href="#" class="comprar" data-id="${id}" data-title="${title}" data-price="${price}" data-image="${image}">Comprar</a>
          </div>
        </article>
      `;
    });
  }

  function renderRecetas(recetas) {
    recetasContainer.innerHTML = '';
    recetas.forEach(receta => {
      const { id, title, price, originalPrice, discount, image } = receta;
      recetasContainer.innerHTML += `
        <article class="products" data-id="${id}">
          <div class="imgBox">
            <img src="${image}" alt="${title}" class="itemOferta" />
          </div>
          <div class="DatosBox">
            <h4>${title}</h4>
            <div class="descard">
              ${originalPrice && discount ? `
                <small>${formatoPrecio(originalPrice)}</small>
                <h4>${discount}%</h4>
              ` : ''}
            </div>
            <h2 class="price">${formatoPrecio(price)}</h2>
            <a href="#" class="comprar" data-id="${id}" data-title="${title}" data-price="${price}" data-image="${image}">Comprar</a>
          </div>
        </article>
      `;
    });
  }

  function renderPromos(productos) {
    if (!promosContainer) return;
    const promos = productos.filter(p => p.discount && p.originalPrice).slice(0, 4);
    promosContainer.innerHTML = promos.map(({ id, title, price, originalPrice, discount, image }) => `
      <article class="products" data-id="${id}">
        <div class="imgBox">
          <img src="${image}" alt="${title}" class="itemOferta" />
        </div>
        <div class="DatosBox">
          <h4>${title}</h4>
          <div class="descard">
            <small>${formatoPrecio(originalPrice)}</small>
            <h4>${discount}%</h4>
          </div>
          <h2 class="price">${formatoPrecio(price)}</h2>
          <a href="#" class="comprar" data-id="${id}" data-title="${title}" data-price="${price}" data-image="${image}">Comprar</a>
        </div>
      </article>
    `).join('');
  }

  function renderRecetariosIndex(recetas) {
    if (!recetariosIndexContainer) return;
    const recetarios = recetas.filter(r => r.discount && r.originalPrice).slice(0, 4);
    recetariosIndexContainer.innerHTML = recetarios.map(({ id, title, price, originalPrice, discount, image }) => `
      <article class="products" data-id="${id}">
        <div class="imgBox">
          <img src="${image}" alt="${title}" class="itemOferta" />
        </div>
        <div class="DatosBox">
          <h4>${title}</h4>
          <div class="descard">
            <small>${formatoPrecio(originalPrice)}</small>
            <h4>${discount}%</h4>
          </div>
          <h2 class="price">${formatoPrecio(price)}</h2>
          <a href="#" class="comprar" data-id="${id}" data-title="${title}" data-price="${price}" data-image="${image}">Comprar</a>
        </div>
      </article>
    `).join('');
  }

  const isIndex = location.pathname.endsWith('index.html') || location.pathname === '/';

  fetch('/data/products.json')
    .then(res => res.json())
    .then(data => {
      if (isIndex) {
        if (promosContainer && data.Productos) renderPromos(data.Productos);
        if (recetariosIndexContainer && data.Recetas) renderRecetariosIndex(data.Recetas);
      } else {
        if (productosContainer && data.Productos) renderProductos(data.Productos);
        if (recetasContainer && data.Recetas) renderRecetas(data.Recetas);
      }
    });

  // --- FORMULARIO CONTACTO ---
  const forms = document.querySelectorAll('.formulario');
  forms.forEach(form => {
    const mensajeEnvio = form.querySelector('.mensaje-envio');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          mensajeEnvio.textContent = '¡Gracias por tu mensaje!';
          mensajeEnvio.style.color = 'green';
          mensajeEnvio.style.display = 'block';
          form.reset();
          setTimeout(() => mensajeEnvio.style.display = 'none', 5000);
        } else {
          mensajeEnvio.textContent = 'Hubo un error. Intentalo más tarde';
          mensajeEnvio.style.color = 'red';
        }
      } catch (error) {
        mensajeEnvio.textContent = 'Error de red. Intentalo más tarde';
        mensajeEnvio.style.color = 'red';
      }
    });
  });

  // --- CUPÓN DE DESCUENTO ---
  const cupónInput = document.getElementById('discount-code');
  const aplicarCuponBtn = document.getElementById('apply-discount');
  const mensajeDescuento = document.getElementById('discount-message');
  const DESCUENTO_PORCENTAJE = 0.10;
  let descuentoActivo = false;

  if (aplicarCuponBtn) {
    aplicarCuponBtn.addEventListener('click', () => {
      const codigo = cupónInput.value.trim().toUpperCase();
      if (codigo === 'BLANETTE10') {
        descuentoActivo = true;
        mensajeDescuento.textContent = 'Cupón aplicado: 10% OFF';
        mensajeDescuento.style.color = 'green';
      } else {
        descuentoActivo = false;
        mensajeDescuento.textContent = 'Cupón inválido';
        mensajeDescuento.style.color = 'red';
      }
      actualizarCarrito();
    });
  }

  const openCartBtn = document.getElementById('open-cart');
  const closeCartBtn = document.getElementById('close-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartCount = document.getElementById('cart-count');
  const sidebarCheckoutBtn = cartSidebar?.querySelector('.checkout-btn');

  const cartPageContainer = document.getElementById('cart-container');
  const cartPageTotal = document.getElementById('cart-page-total');
  const cartPageCheckoutBtn = document.getElementById('checkout-btn');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (openCartBtn && closeCartBtn && cartSidebar) {
    openCartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
  }

  function actualizarCartSidebar() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
    } else {
      carrito.forEach((item, index) => {
        const subtotal = item.price * item.cantidad;
        total += subtotal;
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" />
            <div class="cart-item-info">
              <h4>${item.title}</h4>
              <p>${formatoPrecio(item.price)} x ${item.cantidad}</p>
            </div>
            <button class="cart-remove" onclick="eliminarProducto(${index})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
      });
    }

    cartTotalPrice.textContent = formatoPrecio(total);
    cartCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (sidebarCheckoutBtn) {
      sidebarCheckoutBtn.disabled = carrito.length === 0;
      sidebarCheckoutBtn.onclick = () => {
        if (carrito.length > 0) window.location.href = '/pages/cart.html';
      };
    }
  }

  function renderCartPage() {
    if (!cartPageContainer) return;
    cartPageContainer.innerHTML = '';
    if (carrito.length === 0) {
      cartPageContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
      cartPageTotal.textContent = formatoPrecio(0);
      cartPageCheckoutBtn.disabled = true;
      return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
      const subtotal = item.price * item.cantidad;
      total += subtotal;
      cartPageContainer.innerHTML += `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.title}" />
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <div class="quantity-controls">
              <button class="btn-restar" data-index="${index}">-</button>
              <span class="cantidad">${item.cantidad}</span>
              <button class="btn-sumar" data-index="${index}">+</button>
            </div>
            <p class="subtotal">${formatoPrecio(subtotal)}</p>
          </div>
          <button class="cart-remove" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </article>
      `;
    });

    if (descuentoActivo) {
      const totalConDescuento = total * (1 - DESCUENTO_PORCENTAJE);
      cartPageTotal.textContent = `${formatoPrecio(totalConDescuento)} (10% OFF)`;
    } else {
      cartPageTotal.textContent = formatoPrecio(total);
    }
    cartPageCheckoutBtn.disabled = false;
  }

  function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
  }

  function actualizarCarrito() {
    actualizarCartSidebar();
    renderCartPage();
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('comprar')) {
      e.preventDefault();
      const btn = e.target;
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = parseFloat(btn.dataset.price);
      const image = btn.dataset.image;

      const existente = carrito.find(p => p.id === id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({ id, title, price, image, cantidad: 1 });
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarrito();

      cartSidebar.classList.add('active');

      btn.textContent = '✔ Agregado';
      btn.style.backgroundColor = '#a8665c';
      btn.style.color = 'white';
      btn.disabled = true;


      setTimeout(() => {
        btn.textContent = 'Comprar';
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 5000);
    }

    if (e.target.closest('.cart-remove')) {
      const btn = e.target.closest('.cart-remove');
      const index = btn.dataset.index ?? btn.getAttribute('onclick')?.match(/\d+/)?.[0];
      if (index !== undefined) eliminarProducto(parseInt(index));
    }

    if (e.target.classList.contains('btn-sumar') || e.target.classList.contains('btn-restar')) {
      const index = parseInt(e.target.dataset.index);
      if (isNaN(index)) return;
      if (e.target.classList.contains('btn-sumar')) {
        carrito[index].cantidad += 1;
      } else {
        carrito[index].cantidad -= 1;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarrito();
    }
  });

  actualizarCarrito();
  window.eliminarProducto = eliminarProducto;
});
