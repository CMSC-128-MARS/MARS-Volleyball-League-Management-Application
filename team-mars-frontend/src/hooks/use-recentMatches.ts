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
    status: 'Final' 
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
                        date: "2025-12-01T19:00:00Z",
                        time: "19:00",
                        league: "Premier League",
                        team1: {
                            name: "Thunder Bolts",
                            score: 3
                        },
                        team2: {
                            name: "Fire Dragons", 
                            score: 1
                        },
                        sets: [
                            { team1Score: 25, team2Score: 22 },
                            { team1Score: 23, team2Score: 25 },
                            { team1Score: 25, team2Score: 18 },
                            { team1Score: 25, team2Score: 20 },
                        ],
                        status: 'Final' as const
                    },
                    {
                        id: 2,
                        date: "2025-11-30T20:30:00Z",
                        time: "20:30",
                        league: "Championship League",
                        team1: {
                            name: "Golden Hawks",
                            score: 2
                        },
                        team2: {
                            name: "Storm Riders", 
                            score: 3
                        },
                        sets: [
                            { team1Score: 25, team2Score: 23 },
                            { team1Score: 22, team2Score: 25 },
                            { team1Score: 25, team2Score: 19 },
                            { team1Score: 18, team2Score: 25 },
                            { team1Score: 13, team2Score: 15 },
                        ],
                        status: 'Final' as const
                    },
                    {
                        id: 3,
                        date: "2025-11-29T18:00:00Z",
                        time: "18:00",
                        league: "Premier League",
                        team1: {
                            name: "Ice Eagles",
                            score: 3
                        },
                        team2: {
                            name: "Jaepril's Warriors", 
                            score: 0
                        },
                        sets: [
                            { team1Score: 25, team2Score: 16 },
                            { team1Score: 25, team2Score: 20 },
                            { team1Score: 25, team2Score: 18 },
                        ],
                        status: 'Final' as const
                    }
                ]

                // Simulate API delay (configurable via REACT_APP_API_DELAY_MS, defaults to 400ms)
                const apiDelay = Number(process.env.REACT_APP_API_DELAY_MS) || 400
                await new Promise(resolve => setTimeout(resolve, apiDelay))
                
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

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Format matches for display
    const formattedMatches = matches.map(match => ({
        ...match,
        formattedDate: formatDate(match.date),
        displayText: `${formatDate(match.date)} | ${match.time}`
    }))

    return { matches: formattedMatches, isLoading, error }
}