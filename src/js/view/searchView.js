import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const renderResult = (recipes, page = 1, size = 10) => {
    const start = (page - 1) * size;
    const end = page * size;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, size, recipes.length);
}

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
}

const renderRecipe = recipe => {
    const markup =
        `
            <li>
                <a class="results__link" href="#${recipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
                </a>
            </li>
        `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
                <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`;

const renderButtons = (page, size, total) => {
    const pages = Math.ceil(total / size);
    let button;
    if (page == 1 && pages >= 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}