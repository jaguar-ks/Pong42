export interface User {
    id: number;
    username: string;
    avatar_url: string | null;
    is_online?: boolean;
  }
  
  export interface UserConnection {
    id: number;
    user: User;
    status: string;
    created_at: string;
  }
  
  