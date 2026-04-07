import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react"
import { useState } from "react"

type TableClickedItem = {
    callback: Function
    icon: React.JSX.Element
}

interface CustomTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    header: string[],
    rows: (string | Date | number | TableClickedItem)[][],
    sortBy?: { index: number, type: "ASC" | "DESC" }
}

export function Table(props: CustomTableProps) {
    const [sort, setSort] = useState(props.sortBy);

    function handleSort(index: number) {
        if (sort && sort.index === index) {
            if (sort.type === "ASC") setSort({ index, type: "DESC" });
            else setSort({ index, type: "ASC" });
        } else setSort({ index, type: "ASC" });
    }

    function renderTableItems(items: (string | Date | number | TableClickedItem)[]) {
        return items.map((item, index) => {
            if (typeof item === "string")
                return (<td
                    className="border-y border-neutral-200 py-2 px-1 max-w-max"
                    key={index}
                >
                    {item}
                </td>);

            if (item instanceof Date)
                return (<td
                    className="border-y border-neutral-200 py-2 px-1 max-w-max"
                    key={index}
                >
                    {item.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                </td>);

            if (typeof item === "number")
                return (<td
                    className="border-y border-neutral-200 py-2 px-1 max-w-max"
                    key={index}
                >
                    {item.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>);

            return (<td
                className="border-y border-neutral-200 py-2 px-1 max-w-max"
                key={index}
                onClick={(e) => item.callback()}
            >
                {item?.icon}
            </td>);
        })
    }

    function sortRows(rows: (string | Date | number | TableClickedItem)[][]) {
        if (!sort) return rows;

        return rows.sort((a, b) => {
            if (sort.type === "ASC") return a[sort.index] < b[sort.index] ? -1 : 1;
            return a[sort.index] > b[sort.index] ? -1 : 1;
        });
    }

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
                                    <div className="flex flex-row items-center gap-4">
                                        {item}
                                        {
                                            sort && sort.index === index ?
                                                sort.type === "ASC" ?
                                                    <ArrowUp
                                                        className="cursor-pointer"
                                                        size={18}
                                                        onClick={() => handleSort(index)}
                                                    /> :
                                                    <ArrowDown
                                                        className="cursor-pointer"
                                                        size={18}
                                                        onClick={() => handleSort(index)}
                                                    /> :
                                                <ArrowDownUp
                                                    className="cursor-pointer"
                                                    size={18}
                                                    onClick={() => handleSort(index)}
                                                />
                                        }
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        sortRows(props.rows).map((row, index) => {
                            return (
                                <tr
                                    key={index}
                                >
                                    {renderTableItems(row)}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}