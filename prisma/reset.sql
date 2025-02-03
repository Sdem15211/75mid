-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Truncate all tables
TRUNCATE TABLE "User" CASCADE;
TRUNCATE TABLE "Account" CASCADE;
TRUNCATE TABLE "Session" CASCADE;
TRUNCATE TABLE "VerificationToken" CASCADE;
TRUNCATE TABLE "Authenticator" CASCADE;
TRUNCATE TABLE "Day" CASCADE;
TRUNCATE TABLE "TaskCompletion" CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin'; 