import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRecentMatches } from "@/hooks/use-recentMatches"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export const RecentMatchesCard = () => {
    const { matches, isLoading, error } = useRecentMatches()
    const currentMatch = matches[0]
    const [activeTab, setActiveTab] = useState("1")

    if (isLoading) {
        return (
            <Card className="w-full h-[500px] border border-border shadow-md">
                <CardContent className="space-y-[24px] h-full flex flex-col">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex-1">
                        <Skeleton className="h-full w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!currentMatch) {
        return (
            <Card className="w-full h-[500px] border border-border shadow-md">
                <CardContent className="h-full flex items-center justify-center">
                    <p className="paragraph-n-regular text-gray-600">No recent matches available</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full h-full border border-border shadow-md">
            <CardContent className="space-y-[24px] h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h4 className="text-foreground">Recent Matches</h4>
                        <p className="pg2 text-muted-foreground">
                            {currentMatch.formattedDate} | {currentMatch.time}
                        </p>
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit shadow-md">
                        <TabsList>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <TabsTrigger key={num} value={num.toString()}>
                                    {num}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Match Details */}
                <div className="bg-gray-100 rounded-[2px] p-[24px] border border-border shadow-sm space-y-[32px] flex-1 flex flex-col justify-center">
                    <div className="text-center">
                        <p className="paragraph-n-medium text-foreground">{currentMatch.league}</p>
                        <p className="paragraph-s-regular text-gray-600">{currentMatch.status}</p>
                    </div>

                    {/* Teams 1 Name */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                            <p className={`paragraph-n-regular ${
                                currentMatch.team1.score > currentMatch.team2.score 
                                    ? "text-secondary-alt font-bold" 
                                    : "text-gray-600"
                            }`}>
                                {currentMatch.team1.name}
                            </p>
                        </div>
                        {/*Team 1 Score vs Team 2 Score */}
                        <div className="mx-8 flex items-center space-x-4">
                            <span className={`text-6xl font-bold ${
                                currentMatch.team1.score > currentMatch.team2.score 
                                    ? "text-secondary-alt" 
                                    : "text-foreground"
                            }`}>{currentMatch.team1.score}</span>
                            <span className="text-2xl text-foreground">:</span>
                            <span className={`text-6xl font-bold ${
                                currentMatch.team2.score > currentMatch.team1.score 
                                    ? "text-secondary-alt" 
                                    : "text-foreground"
                            }`}>{currentMatch.team2.score}</span>
                        </div>
                        {/* Teams 2 Name */}
                        <div className="flex-1 text-left">
                            <p className={`paragraph-n-regular ${
                                currentMatch.team2.score > currentMatch.team1.score 
                                    ? "text-secondary-alt font-bold" 
                                    : "text-foreground"
                            }`}>
                                {currentMatch.team2.name}
                            </p>
                        </div>
                    </div>

                    {/* Set Scores */}
                    <div className="flex justify-center space-x-4">
                        {currentMatch.sets.map((set, index) => (
                            <div key={index} className="text-center">
                                <span className="paragraph-s-regular">
                                    <span className={
                                        set.team1Score > set.team2Score 
                                            ? "text-secondary-alt font-medium" 
                                            : ""
                                    }>
                                        {set.team1Score}
                                    </span>
                                    <span className="text-foreground">-</span>
                                    <span className={
                                        set.team2Score > set.team1Score 
                                            ? "text-secondary-alt font-medium" 
                                            : ""
                                    }>
                                        {set.team2Score}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <Button 
                        variant="nav-primary" 
                        disabled={activeTab === "1"}
                        onClick={() => setActiveTab((parseInt(activeTab) - 1).toString())}
                        className={`w-[100px] ${activeTab === "1" ? "opacity-50 cursor-not-allowed" : ""}`}
                        size="sm"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1" />
                        <span className="pg2-bold">Previous</span>
                    </Button>
                    
                    <Button 
                        variant="default" 
                        className="flex-1 mx-4 cursor-pointer"
                        size="sm"
                        onClick={() => {
                            // Reminder: Replace with actual navigation logic
                            alert(`Navigate to match details for Match ${activeTab}`)
                        }}
                    >
                        <span className="pg2-bold">View Details</span>
                    </Button>
                    
                    <Button 
                        variant="nav-primary"
                        disabled={activeTab === "5"}
                        onClick={() => setActiveTab((parseInt(activeTab) + 1).toString())}
                        className={`w-[100px] ${activeTab === "5" ? "opacity-50 cursor-not-allowed" : ""}`}
                        size="sm"
                    >
                        <span className="pg2-bold">Next</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                    </Button>
                </div>

                {error && (
                    <div className="mt-4">
                        <p className="paragraph-xs-regular text-red-500">
                            Error: {error}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}