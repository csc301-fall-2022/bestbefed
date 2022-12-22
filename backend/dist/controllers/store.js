"use strict";
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
exports.updateStoreProfile = exports.getStoreProfile = exports.logoutStore = exports.loginStore = exports.fetchStores = exports.createStore = void 0;
const validator_1 = __importDefault(require("validator"));
const data_source_1 = require("../data-source");
const Store_1 = require("../entity/Store");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const distance_1 = __importDefault(require("@turf/distance"));
const typeorm_1 = require("typeorm");
// Create a store repository that allows us to use TypeORM to interact w/ Store entity in DB.
const storeRepository = data_source_1.AppDataSource.getRepository(Store_1.Store);
/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const storeData = {
            storeName: req.body.storeName.trim(),
            password: req.body.password.trim(),
            email: req.body.email.trim(),
            address: req.body.address.trim(),
            type: ((_a = req.body.type) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "",
        };
        const store = yield cleanStore(storeData);
        // Do not proceed with store creation if there are errors with entered data.
        if (isStoreErrors(store)) {
            // Send back a 400 response to acknowledge register attempt but send back errors
            return res.status(400).send({ errors: store });
        }
        // TODO: Use environment variable for Mapbox access token
        let location = yield fetch(encodeURI(`https://api.mapbox.com/geocoding/v5/mapbox.places/${store.address}.json?country=CA&limit=1&access_token=pk.eyJ1IjoiMWl6YXJkbyIsImEiOiJjbGEzNGRxeTMwbmo4M3BtaHhieDR5MnBrIn0.SOAbn6BE5Qqm86_K5jmECw`))
            .then((res) => {
            return res.json();
        })
            .then((data) => {
            let featureCollection = data;
            if (featureCollection.features.length === 0) {
                res.status(400).json("Specified address does not exist");
                return;
            }
            return featureCollection.features[0].geometry;
        })
            .catch((err) => {
            res.status(503).json(err);
            return;
        });
        if (!location)
            return;
        // All store data was valid - store will now be created properly.
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPass = bcryptjs_1.default.hashSync(store.password, salt);
        const newStore = new Store_1.Store();
        newStore.store_name = store.storeName;
        newStore.email = store.email;
        newStore.address = store.address;
        newStore.create_date = new Date();
        newStore.password = hashedPass;
        newStore.email_verified = false;
        newStore.location = location;
        newStore.type = store.type;
        yield storeRepository.save(newStore);
        // Send back 201 upon successful creation
        res.status(201).json("New store created.");
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.createStore = createStore;
/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const fetchStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user location (if possible), and verify that it is properly formatted
        const location = req.query.location;
        let user_coords;
        if (location) {
            try {
                user_coords = JSON.parse(location);
                if (!Array.isArray(user_coords))
                    throw TypeError;
                if (user_coords.length !== 2)
                    throw TypeError;
                if (typeof user_coords[0] !== "number" ||
                    typeof user_coords[1] !== "number")
                    throw TypeError;
                if (user_coords[0] < -180 ||
                    user_coords[0] > 180 ||
                    user_coords[1] < -90 ||
                    user_coords[1] > 90)
                    throw TypeError;
            }
            catch (err) {
                return res.status(400).json("Location is badly formatted");
            }
        }
        // Takes the URL value tagged by "storeName"
        const requested_store_name = req.query.storeName;
        let storeInfo;
        // if the user did not add "storeName" tag to URL as a filter
        if (!requested_store_name) {
            // get the stores from database
            const stores = yield storeRepository.find();
            storeInfo = stores.map((store) => {
                return Object.assign(Object.assign({ id: store.store_id, storeName: store.store_name, address: store.address, location: store.location }, (user_coords && {
                    distance: (0, distance_1.default)(user_coords, store.location.coordinates),
                })), { type: store.type || undefined });
            });
        }
        else {
            // if the user did add "storeName" tag to URL as a filter
            const stores = yield storeRepository.findBy({
                store_name: (0, typeorm_1.ILike)(`%${requested_store_name}%`),
            });
            storeInfo = stores.map((store) => {
                return Object.assign(Object.assign({ id: store.store_id, storeName: store.store_name, address: store.address, location: store.location }, (user_coords && {
                    distance: (0, distance_1.default)(user_coords, store.location.coordinates),
                })), { type: store.type || undefined });
            });
        }
        res.status(200).json(storeInfo.sort((a, b) => {
            if (a.distance && b.distance) {
                return a.distance - b.distance;
            }
            return 0;
        }));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.fetchStores = fetchStores;
/**
 * Handles POST store/login and attempts to log in and authenticate a store.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const loginStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to query store based on storename
        const store = yield storeRepository.findOneBy({
            store_name: req.body.storeName,
        });
        if (!store) {
            return res.status(404).json("Store does not exist");
        }
        // If store exists, verify password is correct.
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, store.password);
        if (!validPassword) {
            return res.status(400).json("Password is incorrect");
        }
        // Create the JWT to provide store with authentication.
        const payload = {
            type: "store",
            id: store.store_id,
        };
        const token = jsonwebtoken_1.default.sign(payload, ((process.env.PRODUCTION == "true"
            ? process.env.SECRET
            : "hellomyfriend")), {
            expiresIn: "1d",
        });
        res
            .cookie("access_token", token, {
            httpOnly: false,
        })
            .status(200)
            .json({
            storeName: store.store_name,
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.loginStore = loginStore;
/**
 * Handles GET store/logout and attempts to log the store out of their session.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the GET request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure after trying to clear cookie.
 */
const logoutStore = (req, res) => {
    res.clearCookie("access_token");
    res.status(200).send("Logged out!");
};
exports.logoutStore = logoutStore;
/**
 * Handles GET request to /store/profile to provide data to prepopulate a store profile form on frontend.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the GET request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {StoreProfileInfo}          Sends back the fields of the store's profile data
 */
const getStoreProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the respective store's data from the database
        const storeId = req.store.id;
        const store = yield storeRepository.findOneBy({
            store_id: storeId,
        });
        const profileData = {
            store_name: store === null || store === void 0 ? void 0 : store.store_name,
            password: store === null || store === void 0 ? void 0 : store.password,
            address: store === null || store === void 0 ? void 0 : store.address,
            email: store === null || store === void 0 ? void 0 : store.email,
        };
        // Send store their profile data
        res.status(200).json(profileData);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getStoreProfile = getStoreProfile;
/**
 * Handles PATCH request to /store/profile to update data for a store's profile
 *
 * @param {Request}  req   Express.js object that has a request body in the format of StoreProfileInfo (patch request)
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {StoreProfileInfo}          Sends back an object of the store's newly updated data
 */
const updateStoreProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Add validation for incoming data
    try {
        // Update the profile of the store that sent this request
        const storeId = req.store.id;
        // If the store changed their password, re-hash it before storing
        if (req.body.password) {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const password = req.body.password;
            const hashedPass = bcryptjs_1.default.hashSync(password, salt);
            req.body.password = hashedPass;
        }
        yield storeRepository.update(storeId, req.body);
        // TODO: Duplicate code seen in getStoreProfile - maybe refactor
        // Send the store's newly updated data back to them
        const store = yield storeRepository.findOneBy({
            store_id: storeId,
        });
        const profileData = {
            store_name: store === null || store === void 0 ? void 0 : store.store_name,
            password: store === null || store === void 0 ? void 0 : store.password,
            address: store === null || store === void 0 ? void 0 : store.address,
            email: store === null || store === void 0 ? void 0 : store.email,
        };
        res.status(200).json(profileData);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.updateStoreProfile = updateStoreProfile;
// Helper functions
const isStoreErrors = (obj) => {
    return "numErrors" in obj;
};
/**
 * Takes in the request body of a "create store" request, validates and sanitizes the data.
 *
 * @param {StoreRequest}  store   Object containing store data from Store sign-up form.
 *
 * @return {StoreRequest | StoreErrors } Validated.
 */
const cleanStore = (newStore) => __awaiter(void 0, void 0, void 0, function* () {
    // consider implementing try-catch?
    // Takes in the request body of a "create store" request, validates and sanitizes the data
    const errors = {
        numErrors: 0,
        storeName: "",
        password: "",
        email: "",
        address: "",
        type: "",
    };
    // Check if a store with this name already exists in the database
    const existingStore = yield storeRepository.findOneBy({
        store_name: newStore.storeName,
    });
    if (existingStore) {
        errors.numErrors += 1;
        errors["storeName"] = "StoreName already exists! Please sign in.";
    }
    // Verify that password is strong enough
    if (!validator_1.default.isStrongPassword(newStore.password)) {
        errors.numErrors += 1;
        errors["password"] =
            "Password is too weak! You need to have at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol!";
    }
    // Check for valid email address
    if (!validator_1.default.isEmail(newStore.email)) {
        errors.numErrors += 1;
        errors["email"] = "Please enter a valid email address.";
    }
    // TODO: maybe make a better validation for address
    // Check for valid email address
    if (validator_1.default.isEmpty(newStore.address)) {
        errors.numErrors += 1;
        errors["address"] = "Please enter an address.";
    }
    // Needs to return either the cleaned user or errors dictionary
    if (errors.numErrors) {
        return errors;
    }
    else {
        return newStore;
    }
});
