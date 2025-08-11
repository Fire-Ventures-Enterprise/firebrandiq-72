import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { 
  users, profiles, clients, socialConnections, 
  type User, type Profile, type Client, type SocialConnection,
  type InsertUser, type InsertProfile, type InsertClient, type InsertSocialConnection 
} from "@shared/schema";

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Main storage interface
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile management
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined>;
  
  // Client management
  getClients(agencyId: string): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<Client>): Promise<Client | undefined>;
  
  // Social connections
  getSocialConnections(userId: string): Promise<SocialConnection[]>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  updateSocialConnection(id: string, connection: Partial<SocialConnection>): Promise<SocialConnection | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile;
  }

  // Client methods
  async getClients(agencyId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.agencyId, agencyId));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  // Social connections methods
  async getSocialConnections(userId: string): Promise<SocialConnection[]> {
    return await db.select().from(socialConnections).where(eq(socialConnections.userId, userId));
  }

  async createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection> {
    const [newConnection] = await db.insert(socialConnections).values(connection).returning();
    return newConnection;
  }

  async updateSocialConnection(id: string, connection: Partial<SocialConnection>): Promise<SocialConnection | undefined> {
    const [updatedConnection] = await db
      .update(socialConnections)
      .set({ ...connection, updatedAt: new Date() })
      .where(eq(socialConnections.id, id))
      .returning();
    return updatedConnection;
  }
}

// In-memory storage for fallback/development
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private clients: Map<string, Client>;
  private socialConnections: Map<string, SocialConnection>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.clients = new Map();
    this.socialConnections = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = crypto.randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined> {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile: Profile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date()
    };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getClients(agencyId: string): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.agencyId === agencyId);
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = crypto.randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | undefined> {
    const existingClient = this.clients.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient: Client = {
      ...existingClient,
      ...client,
      updatedAt: new Date()
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async getSocialConnections(userId: string): Promise<SocialConnection[]> {
    return Array.from(this.socialConnections.values()).filter(conn => conn.userId === userId);
  }

  async createSocialConnection(insertConnection: InsertSocialConnection): Promise<SocialConnection> {
    const id = crypto.randomUUID();
    const connection: SocialConnection = {
      ...insertConnection,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.socialConnections.set(id, connection);
    return connection;
  }

  async updateSocialConnection(id: string, connection: Partial<SocialConnection>): Promise<SocialConnection | undefined> {
    const existingConnection = this.socialConnections.get(id);
    if (!existingConnection) return undefined;
    
    const updatedConnection: SocialConnection = {
      ...existingConnection,
      ...connection,
      updatedAt: new Date()
    };
    this.socialConnections.set(id, updatedConnection);
    return updatedConnection;
  }
}

// Use database storage when DATABASE_URL is available, otherwise use in-memory storage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
