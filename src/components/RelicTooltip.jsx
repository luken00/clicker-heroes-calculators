import { roundNum } from '../utils';

export default function RelicTooltip(props) {
    const relicTooltipStyle = {
        position: 'absolute',
        left: 55,
        display: props.visible ? 'initial' : 'none',
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        border: '5px solid lightgray',
        borderRadius: 5,
        padding: 5,
        fontSize: 12,
        zIndex: 1,
        width: 300,
    };

    const relicNameStyle = {
        color: props.rarity.color,
        fontSize: 14,
        marginBottom: 5,
    };

    return (
        <div style={relicTooltipStyle}>
            <div style={relicNameStyle}>{props.name}</div>
            <div>{props.rarity.label}</div>
            <div style={{ marginBottom: 15 }}>Level {props.level}</div>

            {
                props.bonuses.map(
                    (b, i) => (
                        <div key={i} style={{ marginBottom: 15 }}>
                            <div>+{roundNum(b.level)} Levels to {b.ancientFullName}</div>
                            <div style={{ color: 'grey' }}>({b.tooltip})</div>
                        </div>
                    )
                )
            }
        </div>
    );
};
