// Web Worker — Verovio rendering with movement support
// Supports multiple movements loaded sequentially
var clearMovements, currentMovement, initInlineVerovio, initVerovio, initVerovioFromGlobal, loadMovement, loadVerovio, movements, renderMovementPage, switchToMovement, tk, verovioInline, verovioLoaded, verovioUrl;

tk = null;

verovioLoaded = false;

verovioUrl = null;

verovioInline = false; // True when Verovio is inlined in SPA mode

movements = {}; // movementId -> {pageCount, loaded, xml, options}

currentMovement = null;

// Clear all movements (call before loading new file)
clearMovements = function() {
  movements = {};
  return currentMovement = null;
};

// Initialize Verovio from global scope (received from main thread)
initVerovioFromGlobal = function(verovioGlobal) {
  var err, mod, verovioReady;
  try {
    // Make Verovio available in worker scope
    self.verovio = verovioGlobal;
    verovioLoaded = true;
    // Initialize toolkit
    mod = verovioGlobal.module;
    if (mod.INITIAL_MEMORY != null) {
      mod.INITIAL_MEMORY = 8 * 1024 * 1024;
    }
    verovioReady = new Promise(function(resolveInit) {
      var prevCallback;
      if (mod.calledRun) {
        return resolveInit();
      } else {
        prevCallback = mod.onRuntimeInitialized;
        return mod.onRuntimeInitialized = function() {
          if (typeof prevCallback === "function") {
            prevCallback();
          }
          return resolveInit();
        };
      }
    });
    return verovioReady.then(function() {
      tk = new verovioGlobal.toolkit();
      return console.log("Worker: Verovio initialized from global scope");
    }).catch(function(err) {
      return console.error("Worker: Verovio initialization failed:", err);
    });
  } catch (error) {
    err = error;
    return console.error("Worker: Failed to initialize Verovio from global:", err);
  }
};

// Load Verovio dynamically and initialize
loadVerovio = function(url) {
  return new Promise(function(resolve, reject) {
    var err, importError;
    try {
      // Check if Verovio is already loaded in this worker scope
      if (verovioLoaded && tk) {
        console.log("Worker: Verovio already loaded and initialized");
        resolve();
        return;
      }
      // Check if it's a blob URL - use fetch+eval instead of importScripts
      if (url.startsWith('blob:')) {
        fetch(url).then(function(response) {
          return response.text();
        }).then(function(code) {
          eval(code);
          verovioLoaded = true;
          return initVerovio(resolve, reject);
        }).catch(reject);
        return;
      }
      // For regular URLs, try to get from cache first (local-first)
      if (!verovioLoaded) {
        console.log(`Worker: Loading Verovio from cache/network: ${url}`);
        try {
          // Try importScripts (will use cache if available via SW)
          importScripts(url);
          verovioLoaded = true;
          console.log("Worker: Verovio loaded via importScripts");
        } catch (error) {
          importError = error;
          console.error("Worker: importScripts failed, trying fetch:", importError);
          // Fallback to fetch+eval
          fetch(url).then(function(response) {
            if (response.ok) {
              return response.text().then(function(code) {
                eval(code);
                verovioLoaded = true;
                console.log("Worker: Verovio loaded via fetch+eval");
                return initVerovio(resolve, reject);
              });
            } else {
              throw new Error(`Failed to fetch Verovio: ${response.status}`);
            }
          }).catch(function(fetchError) {
            console.error("Worker: fetch also failed:", fetchError);
            return reject(fetchError);
          });
          return;
        }
      }
      return initVerovio(resolve, reject);
    } catch (error) {
      err = error;
      console.error("Worker: Error in loadVerovio:", err);
      return reject(err);
    }
  });
};

// Initialize Verovio after loading
initVerovio = function(resolve, reject) {
  var mod, verovioReady;
  mod = verovio.module;
  if (mod.INITIAL_MEMORY != null) {
    mod.INITIAL_MEMORY = 8 * 1024 * 1024;
  }
  verovioReady = new Promise(function(resolveInit) {
    var prevCallback;
    if (mod.calledRun) {
      return resolveInit();
    } else {
      prevCallback = mod.onRuntimeInitialized;
      return mod.onRuntimeInitialized = function() {
        if (typeof prevCallback === "function") {
          prevCallback();
        }
        return resolveInit();
      };
    }
  });
  return verovioReady.then(function() {
    tk = new verovio.toolkit();
    return resolve();
  }).catch(function(err) {
    return reject(err);
  });
};

// Initialize inline Verovio (already loaded in worker code)
initInlineVerovio = function() {
  if (!(typeof verovio !== 'undefined' && !verovioLoaded)) {
    return;
  }
  verovioLoaded = true;
  verovioInline = true;
  return initVerovio(function() {
    return console.log('Inline Verovio initialized');
  }, function(err) {
    return console.error('Inline Verovio init failed:', err);
  });
};

loadMovement = function(movementId, xmlString, pageWidth, pageHeight, scale = 40) {
  var loaded, options, pageCount;
  options = {
    breaks: "auto",
    adjustPageHeight: true,
    pageWidth: pageWidth,
    pageHeight: pageHeight,
    scale: scale,
    condense: "none",
    header: "none",
    footer: "none"
  };
  tk.setOptions(options);
  loaded = tk.loadData(xmlString);
  if (!loaded) {
    self.postMessage({
      type: "error",
      movementId,
      message: "Failed to load movement data"
    });
    return;
  }
  pageCount = tk.getPageCount();
  movements[movementId] = {
    pageCount,
    loaded: true,
    xml: xmlString,
    options
  };
  currentMovement = movementId;
  return self.postMessage({
    type: "movementLoaded",
    movementId,
    pageCount
  });
};

// Switch to a different movement if needed
switchToMovement = function(movementId) {
  var loaded, mv;
  if (currentMovement === movementId) {
    return true;
  }
  mv = movements[movementId];
  if (!(mv != null ? mv.loaded : void 0)) {
    return false;
  }
  // Reload the movement data only if movement changed
  console.log(`Switching to movement ${movementId}`);
  tk.setOptions(mv.options);
  loaded = tk.loadData(mv.xml);
  if (!loaded) {
    return false;
  }
  currentMovement = movementId;
  return true;
};

renderMovementPage = function(movementId, pageNumber) {
  var svg;
  // Switch to the requested movement
  console.log(`Rendering page ${pageNumber} for movement ${movementId}`);
  if (!switchToMovement(movementId)) {
    self.postMessage({
      type: "error",
      movementId,
      message: "Movement not loaded"
    });
    return;
  }
  console.log(`Calling tk.renderToSVG for page ${pageNumber}`);
  svg = tk.renderToSVG(pageNumber);
  console.log(`SVG generated for page ${pageNumber}, size: ${svg.length}`);
  return self.postMessage({
    type: "svg",
    movementId,
    page: pageNumber,
    svg
  });
};

self.onmessage = function(e) {
  var err, movementId, page, pageHeight, pageWidth, scale, type, verovioAvailable, xmlString;
  ({type} = e.data);
  try {
    switch (type) {
      case "verovioInline":
        // Verovio is inlined in SPA mode - initialize it
        return self.postMessage({
          type: "ready"
        });
      case "setVerovioUrl":
        verovioUrl = e.data.url;
        verovioAvailable = e.data.verovioAvailable;
        if (verovioAvailable) {
          console.log("Worker: Verovio available in main thread, loading optimized");
          // Verovio is cached by SW, load should be fast
          return loadVerovio(verovioUrl).then(function() {
            return self.postMessage({
              type: "ready"
            });
          }).catch(function(err) {
            return self.postMessage({
              type: "error",
              message: `Failed to load Verovio: ${err.message || String(err)}`
            });
          });
        } else {
          console.log("Worker: Verovio not in main thread, loading normally");
          return loadVerovio(verovioUrl).then(function() {
            return self.postMessage({
              type: "ready"
            });
          }).catch(function(err) {
            return self.postMessage({
              type: "error",
              message: `Failed to load Verovio: ${err.message || String(err)}`
            });
          });
        }
        break;
      case "init":
        if (tk) {
          return self.postMessage({
            type: "ready"
          });
        }
        break;
      case "clearMovements":
        return clearMovements();
      case "loadMovement":
        if (!tk) {
          return;
        }
        ({movementId, xmlString, pageWidth, pageHeight, scale} = e.data);
        return loadMovement(movementId, xmlString, pageWidth, pageHeight, scale);
      case "renderMovementPage":
        if (!tk) {
          return;
        }
        ({movementId, page} = e.data);
        return renderMovementPage(movementId, page);
    }
  } catch (error) {
    err = error;
    return self.postMessage({
      type: "error",
      message: err.message || String(err)
    });
  }
};
