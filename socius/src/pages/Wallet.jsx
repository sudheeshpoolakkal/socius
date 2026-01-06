import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Wallet = () => {
    const { backendUrl, token, currencySymbol } = useContext(AppContext)
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchWalletData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/wallet', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setBalance(data.balance)
                setTransactions(data.transactions.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const addFunds = async () => {
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }
        try {
            const { data } = await axios.post(backendUrl + '/api/user/add-funds', { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success(data.message)
                setBalance(data.balance)
                setAmount('')
                fetchWalletData() // Refresh transactions
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            fetchWalletData()
        }
    }, [token])

    return (
        <div className='min-h-screen bg-stone-50 pt-10 px-4 sm:px-10 lg:px-20'>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl font-serif text-stone-800 mb-8'>My Wallet</h1>

                {/* Balance & Add Funds Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
                    {/* Balance Card */}
                    <div className='bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-xl p-8 shadow-xl'>
                        <p className='text-stone-300 mb-2'>Current Balance</p>
                        <h2 className='text-4xl font-bold font-serif tracking-in-expand'>{currencySymbol} {balance.toLocaleString()}</h2>
                    </div>

                    {/* Add Funds Card */}
                    <div className='bg-white rounded-xl p-8 shadow-md border border-stone-100'>
                        <h3 className='text-xl font-medium text-stone-800 mb-4'>Add Funds</h3>
                        <div className='flex gap-2'>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className='flex-1 border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:border-stone-400'
                            />
                            <button
                                onClick={addFunds}
                                className='bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors'
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className='bg-white rounded-xl shadow-md border border-stone-100 overflow-hidden'>
                    <h3 className='text-xl font-medium text-stone-800 p-6 border-b border-stone-100'>Transaction History</h3>

                    {loading ? (
                        <div className="p-8 text-center text-stone-500">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center text-stone-500">No transactions yet.</div>
                    ) : (
                        <ul>
                            {transactions.map((txn, index) => (
                                <li key={index} className='flex justify-between items-center p-6 border-b border-stone-50 hover:bg-stone-50 transition-colors'>
                                    <div>
                                        <p className='text-stone-800 font-medium'>{txn.description}</p>
                                        <p className='text-sm text-stone-500'>{new Date(txn.date).toLocaleDateString()} at {new Date(txn.date).toLocaleTimeString()}</p>
                                    </div>
                                    <span className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                        {txn.type === 'credit' ? '+' : '-'} {currencySymbol} {txn.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Wallet
