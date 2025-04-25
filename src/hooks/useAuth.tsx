
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthState, LoginCredentials, User } from "@/types";

// Mock user data - in a real application, this would come from a database
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    password: "password123", // In a real app, never store passwords in plain text!
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    password: "password123",
    name: "Regular User",
    role: "user",
  },
];

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Create context
const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}>({
  authState: initialState,
  login: () => Promise.resolve(false),
  logout: () => {},
});

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        setAuthState({
          ...initialState,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // In a real app, this would be an API call to your backend
    const { username, password } = credentials;
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword as User,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store user in localStorage - in a real app, store a token instead
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
