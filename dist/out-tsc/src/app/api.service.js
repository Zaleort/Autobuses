import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let ApiService = class ApiService {
    constructor(http) {
        this.http = http;
    }
    fetchApi(url) {
        return this.http.get(url);
    }
    hasError(res) {
        return res.error !== undefined;
    }
};
ApiService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], ApiService);
export { ApiService };
//# sourceMappingURL=api.service.js.map