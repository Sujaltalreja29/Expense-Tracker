import React from 'react'
//
import { default as api } from '../store/apiSlice';
import _ from "lodash";

export default function List() {
    const { data, isFetching, isSuccess, isError } = api.useGetTransactionQuery();
    const [deleteTransaction] = api.useDeleteTransactionMutation();

    const handleClick = (e) => {
        if (!e.target.dataset.id) return 0;
        deleteTransaction({ _id: e.target.dataset.id });
    }

    let Transactions;
    if (isFetching) {
        Transactions = <div>Fetching</div>;
    }
    else if (isSuccess) {
        Transactions = data.map((v, i) => (console.log(i) ,<Transaction key={i} category={v} handler={handleClick}></Transaction>));
    }
    else if (isError) {
        Transactions = <div>Error</div>;
    }

    return (
        <div className="flex flex-col py-6 gap-3">
            <h1 className="py-2 font-bold text-xl">History</h1>
            {Transactions}
            
        </div>
    )
}

function Transaction({ category, handler }) {
    if (!category) return null;
    return (
        <div className="item flex justify-center bg-gray-50 py-2 rounded-r" style={{ borderRight: `8px solid ${category.color ?? '#e5e5e5'}` }}>
            <button
                className="px-3 text-black"
                data-id={category._id ?? ''}
                onClick={handler}
            >
                🗑️
            </button>
            <span className="block w-full">
                {_.capitalize(category.name)}-
                {category.amount}
            </span>
        </div>
    )
}
