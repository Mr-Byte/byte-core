import { type HUD, HUDName } from "./ui/hud/index.js";
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

class ByteCore {
    readonly #game: Game;
    #hudModule?: typeof import("./ui/hud/index.js");
    readonly #huds: Map<HUDName, HUD>;

    constructor(game: Game) {
        this.#game = game;
        this.#huds = new Map();
    }

    get drawingHUD(): Promise<HUD> {
        return this.#createHUD(HUDName.DrawingHUD);
    }

    get tokenHUD(): Promise<HUD> {
        return this.#createHUD(HUDName.TokenHUD);
    }

    get tileHUD(): Promise<HUD> {
        return this.#createHUD(HUDName.TileHUD);
    }

    async #createHUD(name: HUDName): Promise<HUD> {
        const hudModule = await this.#loadHUDModule();

        if (!this.#huds.has(name)) {
            this.#huds.set(name, new hudModule.HUD(this.#game, name));
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
