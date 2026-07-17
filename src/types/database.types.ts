export type PlayerPosition =
  | "GK" | "LB" | "CB" | "RB" | "LWB" | "RWB"
  | "CDM" | "CM" | "CAM" | "LM" | "RM" | "LW" | "RW" | "ST" | "CF";
export type PreferredFoot = "left" | "right" | "both";
export type CareerMode = "player" | "manager";
export type MatchStatus = "scheduled" | "live" | "finished";
export type MatchEventType =
  | "goal" | "own_goal" | "yellow_card" | "red_card"
  | "substitution" | "penalty_scored" | "penalty_missed" | "injury";
export type TrophyTier = "club" | "continental" | "international" | "individual";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string; avatar_url: string | null; created_at: string };
        Insert: { id: string; username: string; avatar_url?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      leagues: {
        Row: { id: string; name: string; country: string; tier: number; logo_url: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["leagues"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["leagues"]["Insert"]>;
      };
      seasons: {
        Row: { id: string; league_id: string; year_start: number; year_end: number; is_current: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["seasons"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["seasons"]["Insert"]>;
      };
      clubs: {
        Row: {
          id: string; league_id: string | null; name: string; short_name: string; city: string | null;
          country: string | null; logo_url: string | null; stadium_name: string | null; stadium_capacity: number | null;
          budget_transfer: number; budget_wage: number; reputation: number; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clubs"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["clubs"]["Insert"]>;
      };
      players: {
        Row: {
          id: string; club_id: string | null; first_name: string; last_name: string; nationality: string;
          birth_date: string; height_cm: number | null; preferred_foot: PreferredFoot; position: PlayerPosition;
          shirt_number: number | null; overall_rating: number; potential_rating: number; market_value: number;
          wage: number; contract_expires: string | null; photo_url: string | null; is_user_controlled: boolean; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["players"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
      };
      player_attributes: {
        Row: {
          player_id: string; pace: number | null; shooting: number | null; passing: number | null; dribbling: number | null;
          defending: number | null; physical: number | null; gk_diving: number | null; gk_handling: number | null;
          gk_reflexes: number | null; form: number; morale: number; fitness: number;
        };
        Insert: Database["public"]["Tables"]["player_attributes"]["Row"];
        Update: Partial<Database["public"]["Tables"]["player_attributes"]["Row"]>;
      };
      careers: {
        Row: {
          id: string; profile_id: string; mode: CareerMode; club_id: string | null; player_id: string | null;
          current_season_id: string | null; save_name: string; started_at: string; last_played_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["careers"]["Row"], "id" | "started_at" | "last_played_at"> & {
          id?: string; started_at?: string; last_played_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["careers"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string; season_id: string; home_club_id: string; away_club_id: string; match_date: string;
          home_score: number | null; away_score: number | null; status: MatchStatus; round: number | null; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      match_events: {
        Row: {
          id: string; match_id: string; minute: number; event_type: MatchEventType; player_id: string | null;
          related_player_id: string | null; description: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["match_events"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["match_events"]["Insert"]>;
      };
      transfers: {
        Row: {
          id: string; player_id: string; from_club_id: string | null; to_club_id: string | null;
          fee: number; transfer_date: string; season_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["transfers"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["transfers"]["Insert"]>;
      };
      trophies: {
        Row: { id: string; name: string; competition_name: string; tier: TrophyTier; icon_url: string | null };
        Insert: Omit<Database["public"]["Tables"]["trophies"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["trophies"]["Insert"]>;
      };
      club_trophies: {
        Row: { id: string; club_id: string; trophy_id: string; season_id: string | null; won_at: string };
        Insert: Omit<Database["public"]["Tables"]["club_trophies"]["Row"], "id" | "won_at"> & { id?: string; won_at?: string };
        Update: Partial<Database["public"]["Tables"]["club_trophies"]["Insert"]>;
      };
      player_trophies: {
        Row: { id: string; player_id: string; trophy_id: string; season_id: string | null; won_at: string };
        Insert: Omit<Database["public"]["Tables"]["player_trophies"]["Row"], "id" | "won_at"> & { id?: string; won_at?: string };
        Update: Partial<Database["public"]["Tables"]["player_trophies"]["Insert"]>;
      };
    };
  };
        }
