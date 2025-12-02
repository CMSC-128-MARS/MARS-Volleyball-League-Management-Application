import { useState, useEffect } from 'react'
import type { Team } from '@/types/base_types'

/**
 * Fetches teams data from the API
 * @returns {teams, isLoading, error}
 */

export const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Mock data for development purposes
                const mockTeams: Team[] = [
                    { team_id: "123", team_name: "Jaepril's Warriors", created_at: "2025-11-30", league_id: "xyz-league-1" },
                    { team_id: "123", team_name: "Thunder Bolts", created_at: "2025-11-29", league_id: "xyz-league-1" },
                    { team_id: "123", team_name: "Fire Dragons", created_at: "2025-11-28", league_id: "xyz-league-2" },
                    { team_id: "123", team_name: "Ice Eagles", created_at: "2025-11-27", league_id: "xyz-league-1" },
                    { team_id: "123", team_name: "Storm Riders", created_at: "2025-11-26", league_id: "xyz-league-3" },
                    { team_id: "123", team_name: "Golden Hawks", created_at: "2025-11-25", league_id: "xyz-league-2" },
                ]
                
                // Simulate API delay
                const mockApiDelay = Number(import.meta.env.VITE_MOCK_API_DELAY_MS) || 400
                await new Promise(resolve => setTimeout(resolve, mockApiDelay))
                
                // Sort by most recent (created_at) and limit to 6 teams
                const sortedTeams = mockTeams
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 6)
                    
                setTeams(sortedTeams)
                
                // Uncomment below when your backend is ready:
                // const response = await fetch('/api/teams')
                // if (!response.ok) throw new Error('Failed to fetch teams')
                // const data = await response.json()
                // const apiTeams = data.teams || []
                // // Sort by most recent and limit to 6 teams
                // const sortedApiTeams = apiTeams
                //     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                //     .slice(0, 6)
                // setTeams(sortedApiTeams)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                console.error('Teams fetch error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeams()
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

    return {
        teams,
        isLoading,
        error,
        formatDate
    }
}