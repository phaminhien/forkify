import Search from './model/Search';
import Recipe from './model/Recipe';
import List from './model/List';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import { elements, renderLoader, clearLoader } from './view/base';

const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);
        try {
            await state.search.getResult();
            searchView.renderResult(state.search.result);
        } catch(error) {
            console.log(error);
        }
        clearLoader();
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }    
});

/**
 * RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if (state.search) {
        searchView.highlightSelected(id);
        }
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            console.log(error);
        }
    }
};

/**
 * LIST CONTROLLER
 */

const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServings(state.recipe);
    }
} else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServings(state.recipe);
} else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
}
});