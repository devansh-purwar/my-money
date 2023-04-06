import { useState, useEffect, useReducer } from "react"
import { projectFireStore, timestamp } from '../firebase/config'


let initialState = {
    document: null,
    error: null,
    isPending: null,
    success: null
}


const fireStoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { document: null, error: null, isPending: true, success: null }
        case 'ADDED_DOCUMENT':
            return { document: action.payload, error: null, isPending: false, success: true }
        case 'DELETED_DOCUMENT':
            return { document: action.payload, error: null, isPending: false, success: true }
        case 'ERROR':
            return { document: null, error: action.payload, isPending: false, success: null }
        default:
            return state
    }
}
export const useFireStore = (collection) => {
    const [response, dispatch] = useReducer(fireStoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    const ref = projectFireStore.collection(collection)

    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    const addDocument = async (doc) => {
        dispatch({ type: "IS_PENDING" })

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...doc, createdAt })
            dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument })
        } catch (err) {
            dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
        }

    }

    const deleteDocument = async (id) => {
        dispatch({ action: "IS_PENDING" })

        try {
            const deletedDocument = await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: "DELETED_DOCUMENT", payload: deletedDocument })
        } catch (err) {
            dispatchIfNotCancelled({ type: "ERROR", payload: err.message })

        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, response }
}