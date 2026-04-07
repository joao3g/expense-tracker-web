type TableClickedItem = {
    callback: Function
    icon: React.JSX.Element
}

interface CustomTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    header: string[],
    rows: (string | TableClickedItem)[][]
}

export function Table(props: CustomTableProps) {
    return (
        <div className="px-10 mb-6 w-full">
            <table
                className="table-auto w-full border-collapse tabular-nums"
                {...props}
            >
                <thead>
                    <tr>
                        {props.header.map((item, index) => {
                            return (
                                <th
                                    className="py-2 px-1"
                                    align="left"
                                    key={index}
                                >
                                    {item}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, index) => {
                        return (
                            <tr
                                key={index}
                            >
                                {row.map((item, index) => {
                                    return typeof item === "string" ? (
                                        <td
                                            className="border-y border-neutral-200 py-2 px-1 max-w-max"
                                            key={index}
                                        >
                                            {item}
                                        </td>
                                    ) : (
                                        <td
                                            className="border-y border-neutral-200 py-2 px-1 max-w-max"
                                            key={index}
                                            onClick={(e) => item.callback()}
                                        >
                                            {item?.icon}
                                        </td>
                                    )
                                })
                                }
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}