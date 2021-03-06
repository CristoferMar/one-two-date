set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"userName" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL default now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."lists" (
	"listId" serial NOT NULL,
	"userId" integer NOT NULL,
	"listTitle" TEXT NOT NULL,
	"createdAt" timestamp with time zone NOT NULL default now(),
  "isPublic" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "lists_pk" PRIMARY KEY ("listId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."dates" (
	"dateId" serial NOT NULL,
	"listId" integer NOT NULL,
	"dateIdea" TEXT NOT NULL,
	"costAmount" integer NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT 'true',
	CONSTRAINT "dates_pk" PRIMARY KEY ("dateId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."history" (
	"dateId" integer NOT NULL,
	"userId" integer NOT NULL,
	"addedAt" timestamp with time zone NOT NULL default now()
) WITH (
  OIDS=FALSE
);




ALTER TABLE "lists" ADD CONSTRAINT "lists_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "dates" ADD CONSTRAINT "dates_fk1" FOREIGN KEY ("listId") REFERENCES "lists"("listId");

ALTER TABLE "history" ADD CONSTRAINT "history_fk0" FOREIGN KEY ("itemId") REFERENCES "dates"("itemId");
ALTER TABLE "history" ADD CONSTRAINT "history_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
