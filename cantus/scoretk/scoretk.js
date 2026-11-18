/*! @license GPL-3.0-only — scoretk (façade multi-formats)
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
 * scoretk.js — variante « classic » du paquet wasm (wasm-bindgen
 * --target no-modules), utilisable dans un Web Worker via importScripts().
 *
 *   importScripts('scoretk/classic/scoretk.js');
 *   await self.scoretk.ready;
 *   const midi = self.scoretk.convert(bytes, { to: 'midi' });
 *
 * Le script localise ses propres fichiers (scoretk_wasm.js et
 * scoretk_wasm_bg.wasm) à partir de sa propre URL. Dans un Worker,
 * `document.currentScript` n'existe pas : l'URL est retrouvée dans la pile
 * d'appels, puis dans les entrées de performance. En dernier recours, elle est
 * prise à côté du script worker ; on peut alors forcer la base en définissant
 * `self.SCORETK_BASE_URL` avant l'importScripts.
 */
(function (global) {
  'use strict';

  // Déjà chargé (importScripts peut être appelé plusieurs fois).
  if (global.scoretk) {
    return;
  }

  function ownScriptUrl() {
    if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
      return document.currentScript.src;
    }
    // Worker : V8 écrit « at https://…/scoretk.js:12:9 », SpiderMonkey
    // « func@https://…/scoretk.js:12:9 ».
    try {
      var stack = new Error().stack || '';
      var match = stack.match(/(?:https?|file|blob):\/\/[^\s()]+?\/scoretk\.js(?::\d+){0,2}/);
      if (match) {
        return match[0].replace(/(?::\d+){1,2}$/, '');
      }
    } catch (error) {
      /* on essaie la suite */
    }
    // Les scripts chargés par importScripts apparaissent parfois seulement
    // dans les entrées de performance.
    try {
      var entries =
        global.performance && global.performance.getEntriesByType
          ? global.performance.getEntriesByType('resource')
          : [];
      for (var i = entries.length - 1; i >= 0; i -= 1) {
        if (/\/scoretk\.js(?:\?[^/]*)?$/.test(entries[i].name)) {
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

  // Le glue `no-modules` déclare `let wasm_bindgen = …` : c'est une liaison
  // lexicale globale, visible des autres scripts classiques mais PAS une
  // propriété de `self`. D'où la référence par identifiant, sous `typeof`.
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
      global.importScripts(fileUrl('scoretk_wasm.js'));
    } catch (error) {
      reject(error);
      return;
    }
    var init = glue();
    if (typeof init !== 'function') {
      reject(new Error('scoretk : wasm_bindgen absent après importScripts'));
      return;
    }
    init({ module_or_path: fileUrl('scoretk_wasm_bg.wasm') })
      .then(function () {
        exports = glue();
        resolve(api);
      })
      .catch(reject);
  });

  // Évite un « unhandled rejection » si l'appelant n'attend jamais ready.
  ready.catch(function () {});

  function notReady() {
    return new Error('scoretk : module pas encore prêt ; await self.scoretk.ready');
  }

  function requireReady() {
    if (!exports) {
      throw notReady();
    }
  }

  var api = {
    /** Promesse résolue (avec l'API) quand le .wasm est instancié. */
    ready: ready,
    /** URL de base retenue pour les fichiers du paquet. */
    baseUrl: base,
    /** Convertit un fichier (Uint8Array) vers le format demandé (Uint8Array). */
    convert: function (bytes, options) {
      requireReady();
      return exports.convert(bytes, options);
    },
    /** MusicXML identifié + MIDI + carte des temps ({ musicxml, midi, timeline }). */
    convertWithTimeline: function (bytes, options) {
      requireReady();
      return exports.convertWithTimeline(bytes, options);
    },
    /** Version de la bibliothèque. */
    version: function () {
      requireReady();
      return exports.version();
    },
    /** Format détecté d'après le contenu, ou null. */
    detect: function (bytes) {
      requireReady();
      var format = exports.detect(bytes);
      return format === undefined ? null : format;
    },
    /** [{ name, extensions, read, write }] — capacités réelles du paquet. */
    formats: function () {
      requireReady();
      return exports.formats();
    },
  };

  global.scoretk = api;
})(typeof self !== 'undefined' ? self : this);
