import Button from "./components/Button.js";

export interface ButtonProps {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
    shouldShow?: () => boolean;
}

export const enum Name {
    DrawingHUD = "DrawingHUD",
    TokenHUD = "TokenHUD",
    TileHUD = "TileHUD"
}

export class Manager {
    readonly #game: Game;
    readonly #buttons: Map<string, ButtonProps>;

    constructor(game: Game, name: Name) {
        this.#game = game;
        this.#buttons = new Map();

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButton(id: string, props: ButtonProps) {
        this.#buttons.set(id, props);
    }

    #render(_: unknown, html: JQuery) {
        for (const [_, props] of this.#buttons) {
            const shouldShow = props.shouldShow?.() ?? true;

            if (shouldShow) {
                const title = this.#game.i18n.localize(props.title);
                const button = <Button title={title} icon={props.icon} onClick={() => props.onClick()} />;
                html.find(`div.${props.side}`).append(button);
            }
        }
    }
}