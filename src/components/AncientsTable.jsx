import AncientsTableRow from './AncientsTableRow';

export default function AncientsTable(props)  {
    return (
        <table id="ancients-table" className="table table-hover">
            <thead>
                <tr>
                    <th className="text-center">Ancient</th>
                    <th className="text-center">Coefficient</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.ancients.map((a, k) => (
                        <AncientsTableRow
                            key={k}
                            id={a.id}
                            name={a.label}
                            coefficient={a.coefficients[props.playStyle]}
                            editing={props.editing}
                            toggleEditMode={props.toggleEditMode}
                            setAncientCoefficient={props.setAncientCoefficient}
                        />
                    ))
                }
            </tbody>
        </table>
    );
}
