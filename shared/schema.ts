import { pgTable, text, serial, integer, boolean, uuid, timestamp, decimal, date, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const agencyRoleEnum = pgEnum("agency_role", ["owner", "admin", "manager", "analyst", "member"]);
export const clientStatusEnum = pgEnum("client_status", ["active", "inactive", "trial", "suspended"]);

// Users table (auth users)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Profiles table for user information
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  fullName: text("full_name"),
  company: text("company"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Clients table (moved up to avoid circular reference)
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  industry: text("industry"),
  status: clientStatusEnum("status").default("active").notNull(),
  monthlyBudget: decimal("monthly_budget", { precision: 10, scale: 2 }),
  contractStartDate: date("contract_start_date"),
  contractEndDate: date("contract_end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Social connections table
export const socialConnections = pgTable("social_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  username: text("username"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  platformUserId: text("platform_user_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Agency team members table
export const agencyTeamMembers = pgTable("agency_team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  role: agencyRoleEnum("role").default("member").notNull(),
  permissions: text("permissions").array(),
  invitedBy: uuid("invited_by").references(() => profiles.id),
  invitedAt: timestamp("invited_at", { withTimezone: true }).defaultNow(),
  joinedAt: timestamp("joined_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Client campaigns table
export const clientCampaigns = pgTable("client_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").default("draft").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  metrics: jsonb("metrics").default("{}"),
  createdBy: uuid("created_by").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Email campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isBulk: boolean("is_bulk").default(false).notNull(),
  clientIds: uuid("client_ids").array(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  status: text("status").default("draft").notNull(),
  metrics: jsonb("metrics").default("{}"),
  createdBy: uuid("created_by").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Client analytics table
export const clientAnalytics = pgTable("client_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  date: date("date").notNull(),
  leads: integer("leads").default(0),
  conversions: integer("conversions").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  adSpend: decimal("ad_spend", { precision: 10, scale: 2 }).default("0"),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).default("0"),
  roi: decimal("roi", { precision: 10, scale: 2 }).default("0"),
  metrics: jsonb("metrics").default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  socialConnections: many(socialConnections),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  clients: many(clients),
  teamMemberships: many(agencyTeamMembers),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  agency: one(profiles, {
    fields: [clients.agencyId],
    references: [profiles.id],
  }),
  campaigns: many(clientCampaigns),
  analytics: many(clientAnalytics),
  socialConnections: many(socialConnections),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialConnectionSchema = createInsertSchema(socialConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientCampaignSchema = createInsertSchema(clientCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertSocialConnection = z.infer<typeof insertSocialConnectionSchema>;
export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertClientCampaign = z.infer<typeof insertClientCampaignSchema>;
export type ClientCampaign = typeof clientCampaigns.$inferSelect;
