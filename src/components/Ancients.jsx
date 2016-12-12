import StyleSwitcher from './StyleSwitcher';
import AncientsTable from './AncientsTable';

export default function Ancients(props) {
    const ancientsIII = Object.keys(props.ancients)
        .map(k => props.ancients[k])
        .sort((a, b) => b.coefficients[props.playStyle] - a.coefficients[props.playStyle]);

    const ancientsI = ancientsIII.splice(0, Math.ceil(ancientsIII.length / 3));
    const ancientsII = ancientsIII.splice(0, ancientsI.length);

    return (
        <div className="container">
            <StyleSwitcher
                playStyle={props.playStyle}
                setPlayStyle={props.setPlayStyle}
            />
            <div className="col-md-4">
                <AncientsTable
                    ancients={ancientsI}
                    playStyle={props.playStyle}
                    editing={props.editing}
                    toggleEditMode={props.toggleEditMode}
                    setAncientCoefficient={(ancientId, coefficient) => props.setAncientCoefficient(ancientId, props.playStyle, coefficient)}
                />
            </div>
            <div className="col-md-4">
                <AncientsTable
                    ancients={ancientsII}
                    playStyle={props.playStyle}
                    editing={props.editing}
                    toggleEditMode={props.toggleEditMode}
                    setAncientCoefficient={(ancientId, coefficient) => props.setAncientCoefficient(ancientId, props.playStyle, coefficient)}
                />
            </div>
            <div className="col-md-4">
                <AncientsTable
                    ancients={ancientsIII}
                    playStyle={props.playStyle}
                    editing={props.editing}
                    toggleEditMode={props.toggleEditMode}
                    setAncientCoefficient={(ancientId, coefficient) => props.setAncientCoefficient(ancientId, props.playStyle, coefficient)}
                />
            </div>
        </div>
    );
}
