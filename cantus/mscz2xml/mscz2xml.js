/*! @license GPL-3.0-only — mscz2xml, conversion MuseScore vers MusicXML
 *
 * Copyright (C) 2026 jperon
 *
 * Portage de l'export MusicXML de MuseScore Studio (dépôt
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
 * mscz2xml.js — variante « classic » du paquet wasm (wasm-bindgen
 * --target no-modules), utilisable dans un Web Worker via importScripts().
 *
 *   importScripts('mscz2xml/classic/mscz2xml.js');
 *   await self.mscz2xml.ready;
 *   const xml = self.mscz2xml.convert(bytes, { encodingDate: '2026-01-01' });
 *
 * Le script localise ses propres fichiers (mscz2xml_wasm.js et
 * mscz2xml_wasm_bg.wasm) à partir de sa propre URL. Dans un Worker,
 * `document.currentScript` n'existe pas : l'URL est retrouvée dans la pile
 * d'appels, puis dans les entrées de performance. En dernier recours, elle est
 * prise à côté du script worker ; on peut alors forcer la base en définissant
 * `self.MSCZ2XML_BASE_URL` avant l'importScripts.
 */
(function (global) {
  'use strict';

  // Déjà chargé (importScripts peut être appelé plusieurs fois).
  if (global.mscz2xml) {
    return;
  }

  function ownScriptUrl() {
    if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
      return document.currentScript.src;
    }
    // Worker : V8 écrit « at https://…/mscz2xml.js:12:9 », SpiderMonkey
    // « func@https://…/mscz2xml.js:12:9 ».
    try {
      var stack = new Error().stack || '';
      var match = stack.match(/(?:https?|file|blob):\/\/[^\s()]+?\/mscz2xml\.js(?::\d+){0,2}/);
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
        if (/\/mscz2xml\.js(?:\?[^/]*)?$/.test(entries[i].name)) {
          return entries[i].name;
        }
      }
    } catch (error) {
      /* on essaie la suite */
    }
    return global.location ? global.location.href : '';
  }

  var base = global.MSCZ2XML_BASE_URL;
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
          'mscz2xml : la variante classic.js est prévue pour un Web Worker (importScripts) ; ' +
            'en page, utilisez la variante esm.',
        ),
      );
      return;
    }
    try {
      global.importScripts(fileUrl('mscz2xml_wasm.js'));
    } catch (error) {
      reject(error);
      return;
    }
    var init = glue();
    if (typeof init !== 'function') {
      reject(new Error('mscz2xml : wasm_bindgen absent après importScripts'));
      return;
    }
    init({ module_or_path: fileUrl('mscz2xml_wasm_bg.wasm') })
      .then(function () {
        exports = glue();
        resolve(api);
      })
      .catch(reject);
  });

  // Évite un « unhandled rejection » si l'appelant n'attend jamais ready.
  ready.catch(function () {});

  function notReady() {
    return new Error('mscz2xml : module pas encore prêt ; await self.mscz2xml.ready');
  }

  var api = {
    /** Promesse résolue (avec l'API) quand le .wasm est instancié. */
    ready: ready,
    /** URL de base retenue pour les fichiers du paquet. */
    baseUrl: base,
    /** Convertit un .mscz/.mscx (Uint8Array) en MusicXML (texte). */
    convert: function (bytes, options) {
      if (!exports) {
        throw notReady();
      }
      return exports.convert(bytes, options);
    },
    /** Version de la bibliothèque. */
    version: function () {
      if (!exports) {
        throw notReady();
      }
      return exports.version();
    },
  };

  global.mscz2xml = api;
})(typeof self !== 'undefined' ? self : this);
