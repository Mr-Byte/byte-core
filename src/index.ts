import * as hud from "./ui/hud/index.js";
import DOMFactory from "./DOMFactory.js";

declare global {
    namespace globalThis {
        var byteCore: ByteCore | undefined;
    }
}

Hooks.on("init", () => {
    if (game instanceof Game) {
        globalThis.byteCore = new ByteCore(game);
        Hooks.callAll("byte-core.init");
    }
});

export class ByteCore {
    readonly #game: Game;
    #hudModule?: typeof import("./ui/hud/index.js");
    readonly #huds: Map<hud.Name, hud.Manager<PlaceableObject>>;

    constructor(game: Game) {
        this.#game = game;
        this.#huds = new Map();
    }

    get drawingHUD(): Promise<hud.Manager<Drawing>> {
        return this.#createHUD(hud.Name.DrawingHUD);
    }

    get tokenHUD(): Promise<hud.Manager<Token>> {
        return this.#createHUD(hud.Name.TokenHUD);
    }

    get tileHUD(): Promise<hud.Manager<Tile>> {
        return this.#createHUD(hud.Name.TileHUD);
    }

    async #createHUD(name: hud.Name): Promise<hud.Manager<PlaceableObject>> {
        const hudModule = await this.#loadHUDModule();

        if (!this.#huds.has(name)) {
            this.#huds.set(name, new hudModule.Manager(this.#game, name));
        }

        return this.#huds.get(name)!;
    }

    async #loadHUDModule(): Promise<typeof import("./ui/hud/index.js")> {
        if (!this.#hudModule) {
            this.#hudModule = await import("./ui/hud/index.js");
        }

        return this.#hudModule;
    }

    get DOMFactory(): typeof DOMFactory {
        return DOMFactory;
    }
}
