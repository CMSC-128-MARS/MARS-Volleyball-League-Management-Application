// Import Button component based on the path seen in your LandingPage example
import { RectangleEllipsis } from 'lucide-react';
// --- Consolidated Types and Data ---
interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNo: number;
  teamCode: string;
}

const tableHeaders: string[] = [
  'ID',
  'Player Name',
  'Default Position',
  'Jersey No.',
  'Team Code',
  '', // Action column
];

const playerList: Player[] = [
  { id: '1234', name: 'Doe', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1235', name: 'Smith', position: 'Setter', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1236', name: 'Jones', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1237', name: 'Brown', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1238', name: 'Garcia', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1239', name: 'Chen', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
  { id: '1240', name: 'Lee', position: 'Middle Blocker', jerseyNo: 77, teamCode: 'XYZ' },
];

// ------------------------------------

// The Page component that displays the Player Management UI
const Players = () => {
  const handleViewDetails = (player: Player): void => {
    console.log(`Viewing details for ID: ${player.id}`);
    alert(`Viewing details for ${player.name} (${player.position})`);
  };

  return (
    // Apply container and background colors from your theme
    <div className="">
      <div className="bg-background min-h-screen py-15 text-foreground px-2">
        <div className="mx-auto max-w-7xl lg:ml- px-1 sm:px-20">
          {/* PLAYER MANAGEMENT Title */}
          <h1 className="text-center mb-8 h2  text-foreground ">PLAYER MANAGEMENT</h1>

          {/* Action Buttons: View, Add, Remove */}
          <div className="flex justify-center mb-12 ">
            <div className="inline-flex rounded-l rounded-r border-border overflow-hidden bg-card bg-card shadow-md">
              {/* Active Button Style */}
              <button className="px-4 py-2 paragraph-s-medium text-foreground border-2 rounded-l rounded-r shadow-md bg-primary text-white ">
                View
              </button>
              {/* Default Button Style */}
              <button className="px-4 paragraph-s-medium text-foreground bg-card bg-card ">
                Add
              </button>
              <button className="px-4 paragraph-s-medium text-foreground bg-card bg-card ">
                Remove
              </button>
            </div>
          </div>

          {/* All Players Card */}
          <div className=" border-t-2 border-gray-300 pt-10">
            <div className="bg-card shadow-lg border border-border rounded-xl p-7 px-14 ">
              <h2 className="h4 text-foreground">All Players</h2>
              <p className="paragraph-s-regular text-muted-foreground mb-4 ">
                Last Updated: November 1, 2025
              </p>

              {/* Player Data Table */}
              <div className="overflow-x-auto px-13 ">
                <table className="w-full border-collapse text-left ">
                  <thead>
                    <tr className="border-b border-border border-b-2 border-gray-400 ">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className=" px-4 py-3 paragraph-s-regular font-normal  text-center text-foreground"
                        >
                          {header}
                          {/* Sorting indicator */}
                          {['Player Name', 'Default Position'].includes(header) && (
                            <span className="ml-1 cursor-pointer text-muted-foreground">⇅</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {playerList.map((player, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/60 paragraph-s-regular text-foreground transition-colors odd: bg-muted/100 even:bg-muted/0 group"
                      >
                        <td className="px-2 py-3 text-center">{player.id}</td>
                        <td className="px-2 py-3 text-center">{player.name}</td>
                        <td className="px-2 py-3 text-center">{player.position}</td>
                        <td className="px-2 py-3 text-center">{player.jerseyNo}</td>
                        <td className="px-2 py-3 text-center">{player.teamCode}</td>

                        {/* Action Cell (Group for hover tooltip) */}
                        <td className="relative w-12 text-right ">
                          <div className="relative inline-block ">
                            <button
                              className="p-1 text-muted-foreground hover:text-primary transition-colors peer"
                              onClick={() => handleViewDetails(player)}
                              title="View Player Details"
                            >
                              <RectangleEllipsis className="h-5 w-5 mr-4 " />
                            </button>

                            {/* Tooltip: only visible when hovering the icon (uses peer) */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-primary-foreground text-black border-1 rounded-l rounded-r px-1 py-1 text-xs whitespace-nowrap opacity-0  peer-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20">
                              View Player Details
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;
