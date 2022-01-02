import HUDButton from "./components/HUDButton.js";

export interface HUDButtonProps {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
    shouldShow?: () => boolean;
}

export const enum HUDName {
    DrawingHUD = "DrawingHUD",
    TokenHUD = "TokenHUD",
    TileHUD = "TileHUD"
}

export class HUD {
    readonly #game: Game;
    readonly #buttons: Map<string, HUDButtonProps>;

    constructor(game: Game, name: HUDName) {
        this.#game = game;
        this.#buttons = new Map();

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButton(id: string, props: HUDButtonProps) {
        this.#buttons.set(id, props);
    }

    #render(_: unknown, html: JQuery) {
        for (const [_, props] of this.#buttons) {
            const shouldShow = props.shouldShow?.() ?? true;

            if (shouldShow) {
                const title = this.#game.i18n.localize(props.title);
                const button = <HUDButton title={title} icon={props.icon} onClick={() => props.onClick()} />;
                html.find(`div.${props.side}`).append(button);
            }
        }
    }
}