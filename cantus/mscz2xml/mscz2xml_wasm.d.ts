declare namespace wasm_bindgen {
    /* tslint:disable */
    /* eslint-disable */

    /** Options de `convert`. Toutes sont facultatives. */
    export interface ConvertOptions {
        /**
         * Contenu de `<encoding-date>` (AAAA-MM-JJ). Par défaut, la constante de
         * la bibliothèque, pour des sorties reproductibles.
         */
        encodingDate?: string;
    }



    /**
     * Convertit un `.mscz` ou un `.mscx` en MusicXML `partwise` (texte UTF-8).
     *
     * `input` est le contenu binaire du fichier. Une entrée illisible lève une
     * `Error` JavaScript dont le message est celui de l'erreur Rust d'origine.
     */
    export function convert(input: Uint8Array | number[], options?: ConvertOptions | null): string;

    /**
     * Version de la bibliothèque, telle que déclarée dans `Cargo.toml`.
     */
    export function version(): string;

}
declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly convert: (a: number, b: number, c: number) => [number, number, number, number];
    readonly version: () => [number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

declare type SyncInitInput = BufferSource | WebAssembly.Module;

declare namespace wasm_bindgen {
    /**
     * Instantiates the given `module`, which can either be bytes or
     * a precompiled `WebAssembly.Module`.
     *
     * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
     *
     * @returns {InitOutput}
     */
    export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
declare function wasm_bindgen (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
