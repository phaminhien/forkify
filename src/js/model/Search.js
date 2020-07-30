import axios from 'axios';
import { apiUrl } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const res = await axios(`${apiUrl}/search?&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(error) {
            console.log(error);
        }
    }
}