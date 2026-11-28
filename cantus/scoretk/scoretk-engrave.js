/*! @license GPL-3.0-only — scoretk (façade multi-formats + gravure, WebAssembly)
 *
 * Copyright (C) 2026 jperon
 *
 * Portage de MuseScore Studio (dépôt
 * <https://github.com/musescore/MuseScore>), Copyright (C) MuseScore Limited
 * and others, modifié (réécrit en Rust) en 2026.
 *
 * source : https://github.com/jperon/scoretk
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see the LICENSE file delivered with this package or
 * <https://www.gnu.org/licenses/gpl-3.0.html>.
 */

/*
 * scoretk-engrave.js — variante « classic » du module optionnel de gravure.
 *
 *   importScripts('scoretk/classic/scoretk-engrave.js');
 *   await self.scoretk.ready;
 *   const engraving = self.scoretk.engrave(bytes, { pageWidth: 3000, scale: 40 });
 *   const svg = engraving.renderPage(0);
 *
 * Elle charge `scoretk_engrave.js` / `scoretk_engrave_bg.wasm` (wasm-bindgen
 * --target no-modules) et expose `self.scoretk`, avec la même API de
 * conversion que `scoretk.js` plus `engrave`. Ne pas charger les deux
 * wrappers dans le même Worker : le second serait ignoré.
 */
(function (global) {
  'use strict';

  if (global.scoretk) {
    return;
  }

  function ownScriptUrl() {
    if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
      return document.currentScript.src;
    }
    try {
      var stack = new Error().stack || '';
      var match = stack.match(/(?:https?|file|blob):\/\/[^\s()]+?\/scoretk-engrave\.js(?::\d+){0,2}/);
      if (match) {
        return match[0].replace(/(?::\d+){1,2}$/, '');
      }
    } catch (error) {
      /* on essaie la suite */
    }
    try {
      var entries =
        global.performance && global.performance.getEntriesByType
          ? global.performance.getEntriesByType('resource')
          : [];
      for (var i = entries.length - 1; i >= 0; i -= 1) {
        if (/\/scoretk-engrave\.js(?:\?[^/]*)?$/.test(entries[i].name)) {
          return entries[i].name;
        }
      }
    } catch (error) {
      /* on essaie la suite */
    }
    return global.location ? global.location.href : '';
  }

  var base = global.SCORETK_BASE_URL;
  if (!base) {
    try {
      base = new URL('.', ownScriptUrl()).toString();
    } catch (error) {
      base = '';
    }
  }

  function fileUrl(name) {
    try {
      return new URL(name, base).toString();
    } catch (error) {
      return base + name;
    }
  }

  var exports = null;

  // Le glue `no-modules` déclare `let wasm_bindgen = …` : liaison lexicale
  // globale, pas propriété de `self`.
  function glue() {
    return typeof wasm_bindgen === 'undefined' ? null : wasm_bindgen;
  }

  var ready = new Promise(function (resolve, reject) {
    if (typeof global.importScripts !== 'function') {
      reject(
        new Error(
          'scoretk : la variante classic.js est prévue pour un Web Worker (importScripts) ; ' +
            'en page, utilisez la variante esm.',
        ),
      );
      return;
    }
    try {
      global.importScripts(fileUrl('scoretk_engrave.js'));
    } catch (error) {
      reject(error);
      return;
    }
    var init = glue();
    if (typeof init !== 'function') {
      reject(new Error('scoretk : wasm_bindgen absent après importScripts'));
      return;
    }
    init({ module_or_path: fileUrl('scoretk_engrave_bg.wasm') })
      .then(function () {
        exports = glue();
        resolve(api);
      })
      .catch(reject);
  });

  ready.catch(function () {});

  function requireReady() {
    if (!exports) {
      throw new Error('scoretk : module pas encore prêt ; await self.scoretk.ready');
    }
  }

  var api = {
    ready: ready,
    baseUrl: base,
    convert: function (bytes, options) {
      requireReady();
      return exports.convert(bytes, options);
    },
    convertWithTimeline: function (bytes, options) {
      requireReady();
      return exports.convertWithTimeline(bytes, options);
    },
    convertDetailed: function (bytes, options) {
      requireReady();
      return exports.convertDetailed(bytes, options);
    },
    /** Grave les octets et renvoie un handle { pageCount, renderPage, layout, pageOfElement, relayout, free }. */
    engrave: function (bytes, options) {
      requireReady();
      return exports.engrave(bytes, options);
    },
    version: function () {
      requireReady();
      return exports.version();
    },
    detect: function (bytes) {
      requireReady();
      var format = exports.detect(bytes);
      return format === undefined ? null : format;
    },
    formats: function () {
      requireReady();
      return exports.formats();
    },
  };

  global.scoretk = api;
})(typeof self !== 'undefined' ? self : this);
