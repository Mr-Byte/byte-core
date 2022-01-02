export interface HUDButtonProps {
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
}

export default function HUDButton(props: HUDButtonProps) {
    return (
        <div className="control-icon" onclick={props.onClick}>
            <img src={props.icon} width={36} height={36} title={props.title} />
        </div>
    );
}
