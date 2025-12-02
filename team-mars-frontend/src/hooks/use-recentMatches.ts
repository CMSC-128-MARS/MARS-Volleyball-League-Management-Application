import { useState, useEffect } from 'react'

/**
 * Fetches recent matches data from the API
 * @returns {matches, isLoading, error}
 */

interface Match {
    id: number
    date: string // ISO date string from database
    time: string // Time in HH:MM format
    league: string
    team1: {
        name: string
        score: number
    }
    team2: {
        name: string
        score: number
    }
    sets: Array<{
        team1Score: number
        team2Score: number
    }>
    status: 'Final' | 'Live' | 'Upcoming'
}

export const useRecentMatches = () => {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                // Mock data for development - replace with real API when backend is ready
                const mockMatches = [
                    {
                        id: 1,
                        date: "2025-11-01T21:00:00Z",
                        time: "21:00",
                        league: "XYZ League",
                        team1: {
                            name: "Team 1 Full Name",
                            score: 2
                        },
                        team2: {
                            name: "Team 2 Full Name", 
                            score: 1
                        },
                        sets: [
                            { team1Score: 25, team2Score: 23 },
                            { team1Score: 8, team2Score: 25 },
                            { team1Score: 25, team2Score: 19 },
                        ],
                        status: 'Final' as const
                    }
                ]

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                setMatches(mockMatches)
                
                // Uncomment below when your backend is ready:
                // const response = await fetch('/api/recent-matches')
                // if (!response.ok) throw new Error('Failed to fetch matches')
                // const data = await response.json()
                // setMatches(data.matches || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                console.error('Recent matches error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMatches()
    }, [])

    // Format date to MM-DD-YYYY
    const formatMatchDate = (dateString: string) => {
        const date = new Date(dateString)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        return `${month}-${day}-${year}`
    }

    // Format matches for display
    const formattedMatches = matches.map(match => ({
        ...match,
        formattedDate: formatMatchDate(match.date),
        displayText: `${formatMatchDate(match.date)} | ${match.time}`
    }))

    return { matches: formattedMatches, isLoading, error }
}