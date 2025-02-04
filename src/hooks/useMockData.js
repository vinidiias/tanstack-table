const { useState, useEffect } = require("react")

const useMockData = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/mockData.json")
                const result = await response.json()
                setData(result)
            } catch(err) {
                setError("Failed to fetch data")
            }
        }

        fetchData()
    }, [])

    return { data, error }
}

export default useMockData