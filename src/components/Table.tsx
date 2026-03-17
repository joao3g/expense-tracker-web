interface CustomTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    header: string[],
    rows: string[][]
}

export function Table(props: CustomTableProps) {
    return (
        <div className="mx-10 mb-6">
            <table
                className="table-fixed w-full border-collapse tabular-nums"
                {...props}
            >
                <thead>
                    <tr>
                        {props.header.map((item, index) => { return (<th className="py-2 px-1" align="left" key={index}>{item}</th>) })}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, index) => {
                        return (<tr key={index}>{row.map((item, index) => {
                            return (<td className="border-y border-neutral-200 py-2 px-1" key={index}>{item}</td>)
                        })
                        }</tr>)
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}