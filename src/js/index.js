import Search from './model/Search';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';

const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchResult);
        await state.search.getResult();
        clearLoader();
        searchView.renderResult(state.search.result);
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