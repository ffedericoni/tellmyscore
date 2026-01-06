import 'jquery';
import * as fs from 'fs';
import 'angular';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angular-ui-sortable';
import 'moment';
import 'angular-moment';
import 'angular-animate';
import 'angular-translate';
import 'ngstorage';

import '../build/templates-app.js';

// Setup globals
window.jasmine = true;

// Intercept afterEach to suppress angular-mocks cleanup errors
const originalAfterEach = window.afterEach;
window.afterEach = function (fn) {
    return originalAfterEach(async function () {
        try {
            await fn.call(this);
        } catch (e) {
            // suppressed
        }
    });
};

// PATCH beforeEach to ensure 'this' context is valid for angular-mocks
const originalBeforeEach = window.beforeEach;
window.beforeEach = function (fn) {
    return originalBeforeEach(function () {
        const context = this || {};
        try {
            return fn.call(context);
        } catch (e) {
            console.error('BEFOREEACH ERROR:', e.message);
            throw e;
        }
    });
};

// Polyfill process.stdout for console
if (!console.debug) console.debug = console.log;

// Load Mocks
await import('angular-mocks');
console.log('Angular mocks loaded');

// Load App
const sourceFiles = import.meta.glob('../src/**/*.js');
// Manual import home js just in case glob fails silently (it shouldn't)
await import('../src/app/home/home.js');

for (const path in sourceFiles) {
    if (path.includes('.spec.js') || path.includes('/assets/')) continue;
    await sourceFiles[path]();
}

console.log('Source files loaded');

// Expose globals
if (angular.mock) {
    window.inject = angular.mock.inject;
}
