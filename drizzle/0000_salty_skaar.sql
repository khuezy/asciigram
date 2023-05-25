CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text
);

CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"author_id" uuid NOT NULL,
	"post_id" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"data" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" varchar NOT NULL,
	"author_id" varchar NOT NULL,
	"posts" varchar NOT NULL,
	"time" timestamp DEFAULT now(),
	"text" text
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);

CREATE TABLE IF NOT EXISTS "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "post_idx" ON "comments" ("post_id");
CREATE INDEX IF NOT EXISTS "author_idx" ON "comments" ("author_id");
CREATE INDEX IF NOT EXISTS "post_idx" ON "images" ("post_id");
CREATE INDEX IF NOT EXISTS "post_idx" ON "likes" ("post_id");
CREATE INDEX IF NOT EXISTS "user_idx" ON "likes" ("user_id");
CREATE INDEX IF NOT EXISTS "author_idx" ON "posts" ("author");
CREATE INDEX IF NOT EXISTS "email_id" ON "users" ("email");