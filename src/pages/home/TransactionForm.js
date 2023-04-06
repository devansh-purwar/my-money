import { useEffect, useState } from 'react'
import { useFireStore } from '../../hooks/useFireStore'

export default function TransactionForm({ uid }) {
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const { addDocument, response } = useFireStore('transactions')

    const handleSubmit = (e) => {
        e.preventDefault()
        addDocument({
            name, amount, uid
        })
    }

    useEffect(() => {
        if (response.success) {
            setAmount('')
            setName('')
        }
    }, [response.success])


    return (
        <>
            <h3>Add a Transaction</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Transaction name : </span>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                </label>
                <label>
                    <span>Amount ($): </span>
                    <input
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        required
                    />
                </label>
                <button>Add</button>
            </form>
        </>
    )
}
