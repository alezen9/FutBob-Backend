"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../Utils/helpers");
const lodash_1 = require("lodash");
const entities_1 = require("../entities");
const yup = __importStar(require("yup"));
dotenv_1.default.config();
/**
 * IMPORTANT:
 * Limit per le chiamate a facebook è 25 di default
 * usare gli id dei cursori per andare avanti e indietro di +/- 25
 * oppure il link diretto ad after
 */
const TOKEN = process.env.TOKEN;
const PAGE_ID = process.env.PAGE_ID;
const URL = `https://graph.facebook.com/v6.0/${PAGE_ID}?fields=albums{id, name, photos{images, name}}`;
const BASE_URL_PAGE = `https://graph.facebook.com/v6.0/${PAGE_ID}`;
const BASE_URL = `https://graph.facebook.com/v6.0`;
const errorHandler = (error) => {
    if (error.response) {
        const { status, statusText } = error.response;
        const _error = {
            code: status,
            message: statusText
        };
        throw new entities_1.ApiError(_error);
    }
};
const axiosInstance = axios_1.default.create({
    baseURL: BASE_URL,
    timeout: 100000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
    }
});
const axiosInstancePage = axios_1.default.create({
    baseURL: BASE_URL_PAGE,
    timeout: 100000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
    }
});
axiosInstance.interceptors.response.use(undefined, errorHandler);
axiosInstancePage.interceptors.response.use(undefined, errorHandler);
router.post('/getAlbumIdByName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yup.object().shape({
        name: yup.string().typeError('child name must be string').required('child name is required')
    });
    try {
        const validationError = yield schema
            .validate(req.body)
            .catch(err => new entities_1.ApiError(lodash_1.get(err, 'errors[0]', '')));
        if (validationError instanceof entities_1.ApiError)
            throw validationError;
        const { name } = req.body;
        const _name = helpers_1.getVillageName(name);
        const _res = yield axiosInstancePage.get('?fields=albums{id, name}');
        const { status, data, statusText } = _res;
        let searchedAlbum;
        if (status === 200) {
            const albums = lodash_1.get(data, 'albums.data', []);
            searchedAlbum = lodash_1.find(albums, ['name', _name]);
        }
        else {
            throw new entities_1.ApiError({
                code: status,
                message: statusText
            });
        }
        const response = new entities_1.ApiResponse(searchedAlbum || { id: null, name: _name });
        res.send(response);
    }
    catch (error) {
        res.send(error);
    }
}));
router.post('/getAlbumById', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yup.object().shape({
        id: yup.string().typeError('child id must be string').required('child id is required'),
        pagination: yup.object().shape({
            limit: yup.number(),
            before: yup.string(),
            after: yup.string()
        })
    });
    try {
        const validationError = yield schema
            .validate(req.body)
            .catch(err => new entities_1.ApiError(lodash_1.get(err, 'errors[0]', '')));
        if (validationError instanceof entities_1.ApiError)
            throw validationError;
        const { id, pagination = {} } = req.body;
        const { limit, before, after } = pagination;
        const _pagination = before
            ? `&before=${before}`
            : after
                ? `&after=${after}`
                : '';
        const _limit = limit ? `.limit(${limit})` : '';
        const url = _pagination
            ? `/${id}/photos?fields=name,images${limit ? `&limit=${limit}` : ''}${_pagination}`
            : `/${id}?fields=photos${_limit}${_pagination}{images, name}`;
        const _res = yield axiosInstance.get(url);
        const { data, status, statusText } = _res;
        let responseData;
        if (status === 200) {
            responseData = _pagination
                ? { id, photos: data }
                : Object.assign({}, data);
        }
        else {
            throw new entities_1.ApiError({
                code: status,
                message: statusText
            });
        }
        const response = new entities_1.ApiResponse(responseData);
        res.send(response);
    }
    catch (error) {
        res.send(error);
    }
}));
exports.default = router;
//# sourceMappingURL=apiRoutes.js.map