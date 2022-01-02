export interface ButtonProps {
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
}

export default function Button(props: ButtonProps) {
    return (
        <div className="control-icon" onclick={props.onClick}>
            <img src={props.icon} width={36} height={36} title={props.title} />
        </div>
    );
}
