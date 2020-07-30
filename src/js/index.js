import Search from './model/Search';
import Recipe from './model/Recipe';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
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

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

 elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
    }
    recipeView.updateServings(state.recipe);
 });