-- Seed data for permashare
-- Run after db/create_database.sql
-- Example: psql -U postgres -d permashare -f db/seed.sql

BEGIN;

INSERT INTO "User" (
  user_firstname,
  user_lastname,
  user_email,
  user_password,
  salary,
  goal_amount,
  team_role,
  is_resident
)
VALUES
  ('Taylor', 'Kim', 'taylor@example.com', 'password123', 6200.00, 25000.00, 'Lead Owner', true),
  ('Owen', 'Garcia', 'owen@example.com', 'password123', 5400.00, 22000.00, 'Resident Owner', true),
  ('Rocky', 'Patel', 'rocky@example.com', 'password123', 5000.00, 20000.00, 'Investor', false),
  ('Cole', 'Nguyen', 'cole@example.com', 'password123', 4800.00, 18000.00, 'Investor', false)
ON CONFLICT (user_email) DO NOTHING;

INSERT INTO "Contract" (
  user_id,
  num_contract,
  contract_name,
  contract_time,
  contract_type
)
VALUES (
  (SELECT user_id FROM "User" WHERE user_email = 'taylor@example.com'),
  1,
  'Austin Co-Ownership Agreement',
  36,
  'Shared Equity'
)
ON CONFLICT DO NOTHING;

INSERT INTO "HouseDetails" (
  contract_id,
  house_title,
  listing_price,
  house_value,
  street_address,
  city,
  state,
  zip,
  square_footage,
  num_bedrooms,
  num_bathrooms,
  current_salary_pool,
  deposit_goal,
  mortgage_rate
)
VALUES (
  (SELECT contract_id FROM "Contract" WHERE contract_name = 'Austin Co-Ownership Agreement' LIMIT 1),
  'Modern Family Home - East Austin',
  499000.00,
  485000.00,
  '1234 Oakwood Drive',
  'Austin',
  'TX',
  78702,
  2140.00,
  4,
  2.5,
  21400.00,
  97000.00,
  5.25
)
ON CONFLICT DO NOTHING;

INSERT INTO "Team" (house_id)
VALUES (
  (SELECT house_id FROM "HouseDetails" WHERE house_title = 'Modern Family Home - East Austin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

INSERT INTO "UserTeam" (user_id, team_id)
SELECT u.user_id, t.team_id
FROM "User" u
CROSS JOIN (
  SELECT team_id FROM "Team"
  WHERE house_id = (
    SELECT house_id FROM "HouseDetails"
    WHERE house_title = 'Modern Family Home - East Austin'
    LIMIT 1
  )
  LIMIT 1
) t
WHERE u.user_email IN (
  'taylor@example.com',
  'owen@example.com',
  'rocky@example.com',
  'cole@example.com'
)
ON CONFLICT (user_id, team_id) DO NOTHING;

COMMIT;
