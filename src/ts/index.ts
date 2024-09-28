import { Product } from "./Product";

const serverUrl = "http://localhost:5005";

function main() {
  console.log(serverUrl);
}

document.addEventListener("DOMContentLoaded", main);

let products: Product[] = [];
let filteredProducts: Product[] = [];
let visibleProductsCount = 8;
let cartCount = 0;

const updateCartCount = () => {
  const countDisplay = document.querySelector('.count') as HTMLElement;
  cartCount += 1;
  countDisplay.textContent = String(cartCount);
};

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:5005/products');
    const data = await response.json();
    products = data;
    filteredProducts = products;
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};

const renderProducts = (productsToRender: Product[]) => {
  const productContainer = document.getElementById('products');
  const loadMoreButton = document.querySelector('.product-list__load-more') as HTMLButtonElement;

  if (productContainer) {
    productContainer.innerHTML = '';

    if (productsToRender.length === 0) {
      productContainer.innerHTML = `<p class="no-products">Não há produtos com o filtro selecionado.</p>`;
      loadMoreButton.style.display = 'none';
      return;
    }

    productsToRender.slice(0, visibleProductsCount).forEach((product) => {
      const formattedPrice = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formattedParcelamento = Number(product.parcelamento[1]).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const productCard = `
        <div class="product-card">
          <img class="image" src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">${formattedPrice}</p>
          <p class="parcelamento">até ${product.parcelamento[0]}x de ${formattedParcelamento}</p>
          <p class="size" style="display: none;">${product.size}</p>
          <p class="color" style="display: none;">${product.color}</p>
          <button data-id="${product.id}" class="add-to-cart">Comprar</button>
        </div>
      `;
      productContainer.innerHTML += productCard;
    });

    if (productsToRender.length > visibleProductsCount) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
    }

    addAddToCartEventListeners();
  }
};


const addAddToCartEventListeners = () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart') as NodeListOf<HTMLButtonElement>;

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Produto adicionado ao carrinho');
      showPopup();
      updateCartCount();
    });
  });
};

const showPopup = () => {
  const popup = document.getElementById('popup-add-cart') as HTMLElement;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
  const closePopupBtn = document.getElementById('close-popup') as HTMLButtonElement;

  closePopupBtn.addEventListener('click', () => {
    const popup = document.getElementById('popup-add-cart') as HTMLElement;
    popup.style.display = 'none';
  });
});

const filterProducts = () => {
  const selectedColors = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  ).filter((checkbox: any) => checkbox.id.startsWith('amarelo') || checkbox.id.startsWith('azul') || checkbox.id.startsWith('branco') || checkbox.id.startsWith('cinza') || checkbox.id.startsWith('laranja') || checkbox.id.startsWith('verde') || checkbox.id.startsWith('vermelho') || checkbox.id.startsWith('preto'))
    .map((checkbox: any) => checkbox.id);

  const selectedSizes = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  ).filter((checkbox: any) => checkbox.id.startsWith('tamanho'))
    .map((checkbox: any) => checkbox.id.replace('tamanho-', '').toUpperCase());

  const selectedPrices = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  ).filter((checkbox: any) => checkbox.id.startsWith('preco'))
    .map((checkbox: any) => checkbox.id);

  filteredProducts = products.filter((product) => {
    // Filtra por cor
    const colorMatch = selectedColors.length
      ? selectedColors.includes(product.color.toLowerCase())
      : true;

    // Filtra por tamanho
    const sizeMatch = selectedSizes.length
      ? selectedSizes.some(size => product.size.includes(size.toUpperCase()))
      : true;

    // Filtra por preço
    const priceMatch = selectedPrices.length ? selectedPrices.some((priceRange) => {
      switch (priceRange) {
        case 'preco-0-50':
          return product.price >= 0 && product.price <= 50;
        case 'preco-51-150':
          return product.price >= 51 && product.price <= 150;
        case 'preco-151-300':
          return product.price >= 151 && product.price <= 300;
        case 'preco-301-500':
          return product.price >= 301 && product.price <= 500;
        case 'preco-500':
          return product.price > 500;
        default:
          return true;
      }
    }) : true;

    return colorMatch && sizeMatch && priceMatch;
  });

  visibleProductsCount = 8;
  renderProducts(filteredProducts);
};


const loadMoreProducts = () => {
  visibleProductsCount += 8;
  renderProducts(filteredProducts);
};

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });

  const loadMoreButton = document.querySelector('.product-list__load-more') as HTMLButtonElement;
  loadMoreButton.addEventListener('click', loadMoreProducts);
});

document.addEventListener("DOMContentLoaded", () => {
  const selectTrigger = document.querySelector('.select-trigger') as HTMLDivElement;
  const options = document.querySelectorAll('.custom-option') as NodeListOf<HTMLLIElement>;
  const optionsContainer = document.querySelector('.custom-options') as HTMLUListElement;

  selectTrigger.addEventListener('click', () => {
    optionsContainer.classList.toggle('open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectTrigger.textContent = option.textContent;
      optionsContainer.classList.remove('open');

      const selectedValue = option.getAttribute('data-value');
      console.log(`Ordenar por: ${selectedValue}`);
    });
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      optionsContainer.classList.remove('open');
    }
  });
});




//popup adicionar ao carrinho
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup-add-cart') as HTMLElement;
  const closePopupBtn = document.getElementById('close-popup') as HTMLButtonElement;

  function showPopup() {
    popup.style.display = 'block';

    setTimeout(() => {
      popup.style.display = 'none';
    }, 3000);
  }

  closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const orderBtn = document.querySelector('.filter-mobile .order') as HTMLElement;
  const orderPopup = document.getElementById('order-popup') as HTMLElement;
  const closePopupBtn = document.getElementById('close-order-popup') as HTMLElement;

  if (orderBtn && orderPopup && closePopupBtn) {
    orderBtn.addEventListener('click', () => {
      orderPopup.style.display = 'flex';
    });

    closePopupBtn.addEventListener('click', () => {
      orderPopup.style.display = 'none';
    });

    orderPopup.addEventListener('click', (event: MouseEvent) => {
      if (event.target === orderPopup) {
        orderPopup.style.display = 'none';
      }
    });
  } else {
    console.error('Elementos necessários não encontrados no DOM');
  }
});

//filter mobile
document.addEventListener('DOMContentLoaded', () => {
  const filterBtn = document.querySelector('.filter-mobile .filter') as HTMLElement;
  const filterPopup = document.getElementById('filter-popup') as HTMLElement;
  const closeFilterPopupBtn = document.getElementById('close-filter-popup') as HTMLElement;
  const applyFiltersBtn = document.querySelector('.apply-filters') as HTMLElement;

  if (filterBtn && filterPopup && closeFilterPopupBtn && applyFiltersBtn) {
    filterBtn.addEventListener('click', () => {
      filterPopup.style.display = 'flex';
    });

    closeFilterPopupBtn.addEventListener('click', () => {
      filterPopup.style.display = 'none';
    });

    filterPopup.addEventListener('click', (event: MouseEvent) => {
      if (event.target === filterPopup) {
        filterPopup.style.display = 'none';
      }
    });

    applyFiltersBtn.addEventListener('click', () => {
      filterPopup.style.display = 'none';
    });
  } else {
    console.error('Elementos do filtro não encontrados no DOM');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const filterCategories = document.querySelectorAll('.filter-category') as NodeListOf<HTMLElement>;

  filterCategories.forEach(category => {
    const title = category.querySelector('.title') as HTMLElement;

    title.addEventListener('click', () => {
      const filterList = category.querySelector('.filter-open') as HTMLElement;

      if (filterList.style.display === 'none' || filterList.style.display === '') {
        filterList.style.display = 'block';
        filterList.classList.add('ativo');
        filterList.classList.remove('inativo');
      } else {
        filterList.style.display = 'none';
        filterList.classList.add('inativo');
        filterList.classList.remove('ativo');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const orderPopup = document.getElementById('order-popup') as HTMLElement;
  const closePopupBtn = document.getElementById('close-order-popup') as HTMLElement;
  const orderOptions = document.querySelectorAll('.order-option') as NodeListOf<HTMLElement>;

  const sortProducts = (sortType: string) => {
    if (sortType === 'Maior preço') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortType === 'Menor preço') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else {

    }

    renderProducts(filteredProducts);
  };

  closePopupBtn.addEventListener('click', () => {
    orderPopup.style.display = 'none';
  });

  orderOptions.forEach(option => {
    option.addEventListener('click', () => {
      const sortType = option.textContent;
      sortProducts(sortType || '');
      orderPopup.style.display = 'none';
    });
  });
});

