import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { legacy_createStore as createStore } from "redux";
import { allReducers } from "@/store/reducers/index_reducers";

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, allReducers)

// export default () => {
//     let store = createStore(persistedReducer)
//     let persistor = persistStore(store)
//     return { store, persistor }
// }

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);