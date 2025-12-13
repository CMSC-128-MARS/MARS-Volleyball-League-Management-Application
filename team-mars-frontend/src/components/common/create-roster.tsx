import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SquarePen, Cog, Search, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { teamApiService } from '@/lib/team';
import { toast } from 'sonner';
import { usePlayers } from '@/hooks/use-players';
import type { ApiPlayer } from '@/lib/api';

export default function AddTeamDetails({
  onRosterMethodSelected,
  onClearPlayers,
  selectedMethod,
  onMethodChange,
  onPlayerAdd,
  selectedPlayerIds = [],
  isEditMode = false,
  teamId,
  onPlayerAssigned,
}: {
  onRosterMethodSelected?: () => void;
  onClearPlayers?: () => void;
  selectedMethod?: 'manual' | 'automatic' | null | undefined;
  onMethodChange?: (method: 'manual' | 'automatic' | null) => void;
  onPlayerAdd?: (player: ApiPlayer) => void;
  selectedPlayerIds?: string[];
  isEditMode?: boolean;
  teamId?: string | null;
  onPlayerAssigned?: () => void;
}) {
  const { players, isLoading, error } = usePlayers();
  const [automaticCriteria, setAutomaticCriteria] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleMethodSelect = (method: 'manual' | 'automatic') => {
    if ((selectedMethod ?? '') === method) {
      onMethodChange?.(null);
      return;
    }
    onMethodChange?.(method);
    onRosterMethodSelected?.();
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setIsSelectOpen(false);
    setIsDialogOpen(true);
  };

  const handleAddPlayer = async () => {
    if (!currentPlayer) return;

    const apiPlayer: ApiPlayer = {
      player_id: currentPlayer.id,
      first_name: currentPlayer.first_name || '',
      last_name: currentPlayer.last_name ?? '',
      jersey_number: currentPlayer.jerseyNo ?? null,
      default_position: currentPlayer.position ?? null,
      created_at: currentPlayer.createdAt ?? undefined,
      skill_level: currentPlayer.skill_level ?? null,
      notes: currentPlayer.notes ?? null,
    };

    let loadingToastId: string | number | undefined;
    if (isEditMode && teamId) {
      try {
        setIsAdding(true);
        loadingToastId = toast.loading('Adding player to team...', {
          duration: 5000,
          style: {
            borderRadius: '2px',
            border: '2px solid var(--border)',
          },
        });
        const payload = {
          team_id: teamId,
          player_id: apiPlayer.player_id,
          position: apiPlayer.default_position || null,
          join_date: new Date().toISOString(),
        };

        console.debug('Adding player to team - payload:', payload);
        const resp = await teamApiService.addPlayerToTeam(
          teamId,
          apiPlayer.player_id,
          apiPlayer.default_position || undefined,
        );
        console.debug('Add player to team response:', resp);
        onPlayerAssigned?.();
        try {
          window.dispatchEvent(new CustomEvent('team-player-changed', { detail: { teamId } }));
        } catch {
          /* ignore */
        }
        toast.dismiss(loadingToastId);
        toast.success('Player added to team!', {
          duration: 5000,
          style: {
            color: 'var(--success)',
            borderRadius: '2px',
            border: '2px solid var(--success)',
          },
        });
      } catch (err) {
        console.error('Failed to add player to team:', err);
        toast.dismiss(loadingToastId);
        toast.error('Failed to add player to team. Please try again.', { duration: 5000, style: {
          color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
        } })
        return;
      } finally {
        setIsAdding(false);
      }
    }

    // notify parent so the shared SelectedPlayers area (in AddTeam) updates
    onPlayerAdd?.(apiPlayer);
    setIsSelectOpen(false);
    setIsDialogOpen(false);
    setSelectedPlayer(null);
  };

  const handleGenerateRoster = async () => {
    let count = parseInt(automaticCriteria || '0', 10) || 0;
    // clamp count to 1..7
    if (count <= 0) {
      alert('Please enter a positive number of players to generate.');
      return;
    }
    if (count > 7) count = 7;

    // Clear current roster in parent before generating new players
    onClearPlayers?.();

    setIsGenerating(true);
    try {
      console.debug('Requesting roster generation (position-prioritized) count=', count);

      // Priority targets for a 7-player roster (fills from top for smaller rosters)
      const positionPriority: { key: string; max: number }[] = [
        { key: 'outside', max: 2 },
        { key: 'middle', max: 2 },
        { key: 'setter', max: 1 },
        { key: 'opposite', max: 1 },
        { key: 'libero', max: 1 },
      ];

      type Candidate = {
        player_id?: string;
        id?: string;
        first_name?: string;
        name?: string;
        last_name?: string | null;
        jersey_number?: number | null;
        jerseyNo?: number | null;
        default_position?: string | null;
        position?: string | null;
        created_at?: string;
        createdAt?: string;
        skill_level?: number | null;
        grade?: number | null;
        skillLevel?: number | null;
        notes?: string | null;
      };

      const normalizeToApi = (p: Candidate): ApiPlayer => ({
        player_id: p.player_id ?? p.id ?? '',
        first_name: p.first_name ?? p.name ?? '',
        last_name: p.last_name ?? '',
        jersey_number: p.jersey_number ?? p.jerseyNo ?? null,
        default_position: p.default_position ?? p.position ?? null,
        created_at: p.created_at ?? p.createdAt ?? undefined,
        skill_level: p.skill_level ?? p.grade ?? p.skillLevel ?? null,
        notes: p.notes ?? null,
      });

      // Build local pool (shuffle later)
      const localPool: ApiPlayer[] = players.map((p) => ({
        player_id: p.id,
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        jersey_number: p.jerseyNo ?? null,
        default_position: p.position ?? null,
        created_at: p.createdAt ?? undefined,
        skill_level: p.skill_level ?? null,
        notes: p.notes ?? null,
      }));

      // Try backend generator; if available use it as candidate source
      let backendCandidates: ApiPlayer[] = [];
      try {
        const gen = await teamApiService.generateTeam(count);
        if (Array.isArray(gen)) {
          backendCandidates = gen.map(normalizeToApi);
        }
      } catch (err) {
        console.warn('Backend generateTeam failed or unavailable, continuing with local pool', err);
      }

      // Shuffle helper
      const shuffle = <T,>(arr: T[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      };

      shuffle(backendCandidates);
      shuffle(localPool);

      // Combine backend first (if any), then local
      const combinedPool: ApiPlayer[] = [];
      const seen = new Set<string>();
      backendCandidates.forEach((p) => {
        if (p.player_id && !seen.has(p.player_id)) {
          combinedPool.push(p);
          seen.add(p.player_id);
        }
      });
      localPool.forEach((p) => {
        if (p.player_id && !seen.has(p.player_id)) {
          combinedPool.push(p);
          seen.add(p.player_id);
        }
      });

      const skillOf = (p?: ApiPlayer | null) =>
        p && typeof p.skill_level === 'number' ? p.skill_level : 0;
      const poolAvgSkill =
        combinedPool.reduce((s, x) => s + skillOf(x), 0) / Math.max(1, combinedPool.length);

      const pickBest = (
        candidates: ApiPlayer[],
        chosenIds: Set<string>,
        currentTotal: number,
        currentCount: number,
      ) => {
        let best: ApiPlayer | null = null;
        let bestDelta = Number.POSITIVE_INFINITY;
        for (const cand of candidates) {
          if (chosenIds.has(cand.player_id)) continue;
          const candSkill = skillOf(cand);
          const projectedAvg = (currentTotal + candSkill) / Math.max(1, currentCount + 1);
          const delta = Math.abs(projectedAvg - poolAvgSkill);
          if (delta < bestDelta) {
            bestDelta = delta;
            best = cand;
          }
        }
        return best;
      };

      const chosen: ApiPlayer[] = [];
      const chosenIds = new Set<string>();
      let remaining = count;
      let currentTotalSkill = 0;

      // Fill by priority
      for (const pos of positionPriority) {
        if (remaining <= 0) break;
        const want = Math.min(pos.max, remaining);
        if (want <= 0) continue;

        const matches = combinedPool.filter(
          (p) =>
            !chosenIds.has(p.player_id) &&
            (p.default_position ?? '').toLowerCase().includes(pos.key),
        );

        for (let i = 0; i < want; i++) {
          const pick = pickBest(matches, chosenIds, currentTotalSkill, chosen.length);
          if (!pick) break;
          chosen.push(pick);
          chosenIds.add(pick.player_id);
          currentTotalSkill += skillOf(pick);
          remaining -= 1;
        }
      }

      // Fill remaining from whole pool
      while (remaining > 0) {
        const pick = pickBest(combinedPool, chosenIds, currentTotalSkill, chosen.length);
        if (!pick) break;
        chosen.push(pick);
        chosenIds.add(pick.player_id);
        currentTotalSkill += skillOf(pick);
        remaining -= 1;
      }

      // Notify parent
      chosen.forEach((c) => onPlayerAdd?.(c));
      onRosterMethodSelected?.();
      toast.dismiss(loadingToastId);
      toast.success('Roster generated successfully!', {
        duration: 5000,
        style: {
          color: 'var(--success)',
          borderRadius: '2px',
          border: '2px solid var(--success)',
        },
      });
    } catch (err) {
      console.error('Failed to generate roster:', err);
      toast.dismiss(loadingToastId);
      toast.error('Failed to generate roster. Please try again.', { duration: 5000, style: {
        color: "var(--destructive)", borderRadius: "2px", border: "2px solid var(--destructive)"
      } })
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlayer = players.find((p) => p.id === selectedPlayer) ?? null;

  const getPositionAcronym = (pos?: string | null) => {
    if (!pos) return '';
    const p = pos.toLowerCase().trim();
    if (p === 's' || p.includes('setter')) return 'S';
    if (p === 'mb' || p.includes('middle')) return 'MB';
    if (p === 'outh' || p.includes('outside')) return 'OutH';
    if (
      p === 'opph' ||
      p.includes('opposite') ||
      p.includes('opposite hitter') ||
      p.includes('opp')
    )
      return 'OppH';
    if (p === 'l' || p.includes('libero')) return 'L';
    if (p === 'ds' || p.includes('defensive')) return 'DS';
    return '';
  };

  return (
    <div className="w-full h-full shadow-md">
      <Card className={`gap-2 transition-all duration-200 ${isSelectOpen ? 'pb-35 lg:pb-0' : ''}`}>
        <CardHeader className="items-center px-6 pt-4">
          <CardTitle className="flex flex-col justify-start items-start w-full gap-1">
            <h4>{isEditMode ? 'Add Players' : 'Create Roster'}</h4>
            {!isEditMode && (
              <p className="text-sm text-gray-500 font-paragraph text-4">
                Choose manual or automatic roster creation
              </p>
            )}
          </CardTitle>
        </CardHeader>
        <hr className="w-full border-t border-[#A3A3A3]" />
        <CardContent className="flex flex-col md:flex-row gap-6 pb-6 pt-4 items-start justify-center">
          {!isEditMode && selectedMethod !== 'automatic' && (
            <div
              onClick={() => handleMethodSelect('manual') }
              className={`w-full md:w-1/2 hover:cursor-pointer rounded-sm shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px] transition-colors ${
                selectedMethod === 'manual'
                  ? 'border-primary bg-primary/5'
                  : 'border-[#E5E5E5] hover:border-[#737373]'
              }`}
            >
              <SquarePen />
              <h4>Manual Creation</h4>
              <p className="text-sm text-gray-500 font-paragraph text-center">
                Choose your players manually to create a roster
              </p>
            </div>
          )}
          {!isEditMode && (selectedMethod ?? '') === 'automatic' && (
            <div
              onClick={() => handleMethodSelect('automatic')}
              className={`w-full md:w-1/2 hover:cursor-pointer rounded-sm shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px] transition-colors ${
                (selectedMethod ?? '') === 'automatic'
                  ? 'border-primary bg-primary/5'
                  : 'border-[#E5E5E5] hover:border-[#737373]'
              }`}
            >
              <Cog />
              <h4>Automatic Creation</h4>
              <p className="text-sm text-gray-500 font-paragraph text-center">
                Chooses players by skill to form a balanced roster.
              </p>
            </div>
          )}
          {(selectedMethod ?? '') === 'manual' || isEditMode ? (
            <div
              className={`flex flex-col gap-2 items-start ${isEditMode ? 'w-full' : 'w-full md:w-1/2'}`}
            >
              <p>
                Enter Players <span className="text-secondary-alt">*</span>
              </p>
              <Select onValueChange={handlePlayerSelect} onOpenChange={setIsSelectOpen}>
                <SelectTrigger
                  className="w-full rounded-sm border border-[#E5E5E5] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] justify-start"
                  showChevron={false}
                >
                  <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                  {selectedPlayer ? (
                    <div className="truncate">
                      {(() => {
                        const p = players.find((x) => x.id === selectedPlayer);
                        if (!p) return isLoading ? 'Loading players...' : 'Search players';
                        return (
                          <>
                            {p.first_name} {p.last_name || ''}
                            {p.jerseyNo ? ` #${p.jerseyNo}` : ''}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={isLoading ? 'Loading players...' : 'Search players'}
                    />
                  )}
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  <SelectGroup>
                    <SelectLabel>Select a player</SelectLabel>
                    {error && (
                      <div className="px-2 py-1.5 text-sm text-red-600">Error loading players</div>
                    )}
                    {!isLoading && !error && players.length === 0 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No players available
                      </div>
                    )}
                    {players.map((player) => {
                      const acronym = getPositionAcronym(player.position);
                      return (
                        <SelectItem
                          key={player.id}
                          value={player.id}
                          disabled={selectedPlayerIds.includes(player.id)}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="min-w-0 truncate">
                              {player.first_name} {player.last_name}
                              {player.jerseyNo ? ` #${player.jerseyNo}` : ''}
                            </div>

                            <span className="text-sm text-muted-foreground ml-4 shrink-0">
                              {acronym}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0 max-h-[90vh] flex flex-col md:max-w-2xl">
                  <DialogHeader className="text-left -mt-2 mb-2 flex-shrink-0">
                    <DialogTitle>
                      <h4>Player Details</h4>
                    </DialogTitle>
                  </DialogHeader>
                  <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] flex-shrink-0" />
                  <div className="overflow-y-auto flex-1 scrollbar-hide">
                    {currentPlayer && (
                      <div className="flex flex-col gap-3 mt-6">
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">First Name</p>
                            <Input
                              value={currentPlayer.first_name ?? ''}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Last Name</p>
                            <Input
                              value={currentPlayer.last_name ?? 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Jersey Number</p>
                            <Input
                              value={currentPlayer.jerseyNo?.toString() || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">Default Position</p>
                            <Input
                              value={currentPlayer.position || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Player Creation Date</p>
                            <Input
                              value={
                                currentPlayer.createdAt
                                  ? new Date(currentPlayer.createdAt).toLocaleDateString()
                                  : 'N/A'
                              }
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[14px] text-black mb-1">Skill Level</p>
                            <Input
                              value={currentPlayer.skill_level?.toString() || 'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-[14px] text-black mb-1">Date Evaluated</p>
                            <Input
                              value={'N/A'}
                              readOnly
                              className="bg-gray-50 text-[14px] text-gray-500"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[14px] text-black mb-1">Notes</p>
                          <Input
                            value={currentPlayer.notes || 'N/A'}
                            readOnly
                            className="bg-gray-50 text-[14px] text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="w-[calc(100%+3rem)] -ml-6 border-t border-[#A3A3A3] mt-6 flex-shrink-0" />
                  <div className="w-full mt-4 flex-shrink-0">
                    <Button className="w-full" onClick={handleAddPlayer} isLoading={isAdding}>
                      <UserRoundPlus className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      <p className="font-extralight">Add Player</p>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (selectedMethod ?? '') === 'automatic' ? (
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-3">
                <p>
                  Enter number of players <span className="text-secondary-alt">*</span>
                </p>

                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={1}
                  max={7}
                  step={1}
                  value={automaticCriteria}
                  onChange={(e) => {
                    const raw = e.target.value || '';
                    const digits = raw.replace(/[^0-9]/g, '');
                    if (digits === '') {
                      setAutomaticCriteria('');
                      return;
                    }
                    let n = parseInt(digits, 10);
                    if (!Number.isFinite(n) || n <= 0) {
                      setAutomaticCriteria('');
                      return;
                    }
                    // Enforce cap between 1 and 7
                    if (n > 7) n = 7;
                    setAutomaticCriteria(String(n));
                  }}
                  placeholder="Maximum: 7"
                  className="w-full rounded-sm"
                />

                <Button
                  onClick={handleGenerateRoster}
                  isLoading={isGenerating}
                  className="w-full mt-2"
                >
                  Generate Roster
                </Button>
              </div>
            </div>
          ) : (
            !isEditMode && (
              <div
                onClick={() => handleMethodSelect('automatic')}
                className={`w-full md:w-1/2 hover:cursor-pointer rounded-sm shadow-md flex flex-col gap-2 items-center justify-center border px-6 py-8 h-[178px] transition-colors ${
                  (selectedMethod ?? '') === 'automatic'
                    ? 'border-primary bg-primary/5'
                    : 'border-[#E5E5E5] hover:border-[#737373]'
                }`}
              >
                <Cog />
                <h4>Automatic Creation</h4>
                <p className="text-sm text-gray-500 font-paragraph text-center">
                  Chooses players by skill to form a balanced roster.
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
