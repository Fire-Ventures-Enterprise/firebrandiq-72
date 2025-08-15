import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { 
  users, profiles, clients, socialConnections, socialPosts, socialMetrics,
  type User, type Profile, type Client, type SocialConnection, type SocialPost, type SocialMetric,
  type InsertUser, type InsertProfile, type InsertClient, type InsertSocialConnection, type InsertSocialPost, type InsertSocialMetric
} from "@shared/schema";

// Database connection - only if URL is provided
const db = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL 
  ? drizzle(neon(process.env.SUPABASE_DB_URL || process.env.DATABASE_URL!)) 
  : null;

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
  getSocialConnection(id: string): Promise<SocialConnection | undefined>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  updateSocialConnection(id: string, connection: Partial<SocialConnection>): Promise<SocialConnection | undefined>;
  deleteSocialConnection(id: string): Promise<boolean>;
  
  // Social posts
  getSocialPosts(connectionId: string): Promise<SocialPost[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  
  // Social metrics
  getSocialMetrics(connectionId: string, dateRange?: { start: Date; end: Date }): Promise<SocialMetric[]>;
  createSocialMetric(metric: InsertSocialMetric): Promise<SocialMetric>;
}

export class DatabaseStorage implements IStorage {
  private getDB() {
    if (!db) throw new Error('Database not initialized');
    return db;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.getDB().select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.getDB().select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await this.getDB().insert(users).values(user).returning();
    return newUser;
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await this.getDB().select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await this.getDB().select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await this.getDB().insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined> {
    const [updatedProfile] = await this.getDB()
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile;
  }

  // Client methods
  async getClients(agencyId: string): Promise<Client[]> {
    return await this.getDB().select().from(clients).where(eq(clients.agencyId, agencyId));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await this.getDB().select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await this.getDB().insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | undefined> {
    const [updatedClient] = await this.getDB()
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  // Social connections methods
  async getSocialConnections(userId: string): Promise<SocialConnection[]> {
    return await this.getDB().select().from(socialConnections).where(eq(socialConnections.userId, userId));
  }

  async createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection> {
    const [newConnection] = await this.getDB().insert(socialConnections).values(connection).returning();
    return newConnection;
  }

  async getSocialConnection(id: string): Promise<SocialConnection | undefined> {
    const [connection] = await this.getDB().select().from(socialConnections).where(eq(socialConnections.id, id));
    return connection;
  }

  async updateSocialConnection(id: string, connection: Partial<SocialConnection>): Promise<SocialConnection | undefined> {
    const [updatedConnection] = await this.getDB()
      .update(socialConnections)
      .set({ ...connection, updatedAt: new Date() })
      .where(eq(socialConnections.id, id))
      .returning();
    return updatedConnection;
  }

  async deleteSocialConnection(id: string): Promise<boolean> {
    const result = await this.getDB().delete(socialConnections).where(eq(socialConnections.id, id));
    return result.rowCount > 0;
  }

  // Social posts methods
  async getSocialPosts(connectionId: string): Promise<SocialPost[]> {
    return await this.getDB().select().from(socialPosts).where(eq(socialPosts.connectionId, connectionId));
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const [newPost] = await this.getDB().insert(socialPosts).values(post).returning();
    return newPost;
  }

  // Social metrics methods
  async getSocialMetrics(connectionId: string, dateRange?: { start: Date; end: Date }): Promise<SocialMetric[]> {
    let query = this.getDB().select().from(socialMetrics).where(eq(socialMetrics.connectionId, connectionId));
    
    if (dateRange) {
      // Add date range filtering logic here if needed
    }
    
    return await query;
  }

  async createSocialMetric(metric: InsertSocialMetric): Promise<SocialMetric> {
    const [newMetric] = await this.getDB().insert(socialMetrics).values(metric).returning();
    return newMetric;
  }
}

// In-memory storage for fallback/development
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private clients: Map<string, Client>;
  private socialConnections: Map<string, SocialConnection>;

  private socialPosts: Map<string, SocialPost>;
  private socialMetrics: Map<string, SocialMetric>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.clients = new Map();
    this.socialConnections = new Map();
    this.socialPosts = new Map();
    this.socialMetrics = new Map();
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
      password: insertUser.password || null,
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
      fullName: insertProfile.fullName || null,
      company: insertProfile.company || null,
      avatarUrl: insertProfile.avatarUrl || null,
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
      companyName: insertClient.companyName || null,
      email: insertClient.email || null,
      phone: insertClient.phone || null,
      website: insertClient.website || null,
      industry: insertClient.industry || null,
      monthlyBudget: insertClient.monthlyBudget || null,
      contractStartDate: insertClient.contractStartDate || null,
      contractEndDate: insertClient.contractEndDate || null,
      notes: insertClient.notes || null,
      status: insertClient.status || 'active',
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
      username: insertConnection.username || null,
      avatarUrl: insertConnection.avatarUrl || null,
      accessToken: insertConnection.accessToken || null,
      refreshToken: insertConnection.refreshToken || null,
      tokenExpiresAt: insertConnection.tokenExpiresAt || null,
      lastSyncAt: insertConnection.lastSyncAt || null,
      clientId: insertConnection.clientId || null,
      platformUserId: insertConnection.platformUserId || null,
      profileUrl: insertConnection.profileUrl || null,
      followerCount: insertConnection.followerCount || null,
      followingCount: insertConnection.followingCount || null,
      postCount: insertConnection.postCount || null,
      apiQuotaUsed: insertConnection.apiQuotaUsed || null,
      apiQuotaLimit: insertConnection.apiQuotaLimit || null,
      webhookUrl: insertConnection.webhookUrl || null,
      scopes: insertConnection.scopes || null,
      metadata: insertConnection.metadata || {},
      isActive: insertConnection.isActive ?? true,
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

  async getSocialConnection(id: string): Promise<SocialConnection | undefined> {
    return this.socialConnections.get(id);
  }

  async deleteSocialConnection(id: string): Promise<boolean> {
    return this.socialConnections.delete(id);
  }

  async getSocialPosts(connectionId: string): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values()).filter(post => post.connectionId === connectionId);
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const id = crypto.randomUUID();
    const post: SocialPost = {
      ...insertPost,
      id,
      mediaUrls: insertPost.mediaUrls || null,
      hashtags: insertPost.hashtags || null,
      mentions: insertPost.mentions || null,
      likesCount: insertPost.likesCount || null,
      commentsCount: insertPost.commentsCount || null,
      sharesCount: insertPost.sharesCount || null,
      engagementRate: insertPost.engagementRate || null,
      fetchedAt: new Date(),
      createdAt: new Date()
    };
    this.socialPosts.set(id, post);
    return post;
  }

  async getSocialMetrics(connectionId: string, dateRange?: { start: Date; end: Date }): Promise<SocialMetric[]> {
    let metrics = Array.from(this.socialMetrics.values()).filter(metric => metric.connectionId === connectionId);
    
    if (dateRange) {
      metrics = metrics.filter(metric => {
        const date = new Date(metric.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }
    
    return metrics;
  }

  async createSocialMetric(insertMetric: InsertSocialMetric): Promise<SocialMetric> {
    const id = crypto.randomUUID();
    const metric: SocialMetric = {
      ...insertMetric,
      id,
      followers: insertMetric.followers || null,
      following: insertMetric.following || null,
      posts: insertMetric.posts || null,
      likes: insertMetric.likes || null,
      comments: insertMetric.comments || null,
      shares: insertMetric.shares || null,
      impressions: insertMetric.impressions || null,
      reach: insertMetric.reach || null,
      engagementRate: insertMetric.engagementRate || null,
      createdAt: new Date()
    };
    this.socialMetrics.set(id, metric);
    return metric;
  }
}

// Use in-memory storage for development
export const storage = new MemStorage();
