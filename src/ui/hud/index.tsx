import Button from "./components/Button.js";

export interface ButtonProps<T extends PlaceableObject> {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: () => boolean;
}

export const enum Name {
    DrawingHUD = "DrawingHUD",
    TokenHUD = "TokenHUD",
    TileHUD = "TileHUD"
}

export class Manager<T extends PlaceableObject> {
    readonly #game: Game;
    readonly #buttons: Map<string, ButtonProps<T>>;

    constructor(game: Game, name: Name) {
        this.#game = game;
        this.#buttons = new Map();

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButton(id: string, props: ButtonProps<T>) {
        this.#buttons.set(id, props);
    }

    #render(hud: BasePlaceableHUD, html: JQuery) {
        for (const [_, props] of this.#buttons) {
            const shouldShow = props.shouldShow?.() ?? true;

            if (shouldShow) {
                const title = this.#game.i18n.localize(props.title);
                const button = <Button title={title} icon={props.icon} onClick={() => props.onClick(hud.object as T)} />;
                html.find(`div.${props.side}`).append(button);
            }
        }
    }
}