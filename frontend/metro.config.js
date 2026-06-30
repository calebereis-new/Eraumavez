// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');
const { FileStore } = require('metro-cache');

const config = getDefaultConfig(__dirname);

// Use a stable on-disk store (shared across web/android)
const root = process.env.METRO_CACHE_ROOT || path.join(__dirname, '.metro-cache');
config.cacheStores = [
  new FileStore({ root: path.join(root, 'cache') }),
];

// Reduce file watchers: ignora dirs nativos pesados em node_modules (causa ENOSPC em containers).
config.resolver = config.resolver || {};
config.resolver.blockList = [
  /\/node_modules\/.+\/(android|ios|windows|macos)\/.*/,
  /\/node_modules\/react-native\/ReactAndroid\/.*/,
  /\/node_modules\/react-native\/ReactCommon\/.*/,
  /\/node_modules\/react-native\/sdks\/.*/,
  /\/node_modules\/react-native\/Libraries\/.*\.(h|m|mm|cpp)$/,
  /\/\.git\/.*/,
];
config.watchFolders = [__dirname];

// // Exclude unnecessary directories from file watching
// config.watchFolders = [__dirname];
// config.resolver.blacklistRE = /(.*)\/(__tests__|android|ios|build|dist|.git|node_modules\/.*\/android|node_modules\/.*\/ios|node_modules\/.*\/windows|node_modules\/.*\/macos)(\/.*)?$/;

// // Alternative: use a more aggressive exclusion pattern
// config.resolver.blacklistRE = /node_modules\/.*\/(android|ios|windows|macos|__tests__|\.git|.*\.android\.js|.*\.ios\.js)$/;

// Reduce the number of workers to decrease resource usage
config.maxWorkers = 2;

module.exports = config;
