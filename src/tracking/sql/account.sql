-- :name users-read :? :*
SELECT * FROM users
ORDER BY username;

-- :name users-data-read :? :*
SELECT username, role FROM users;

-- :name user-delete! :! :n
DELETE FROM users
WHERE username = :username

-- :name user-upd-role! :<! :1
UPDATE users
SET role = :role
WHERE username = :username
RETURNING *;

-- :name by-role-users-get :? :*
SELECT DISTINCT users.* FROM users
INNER JOIN usersinroles
ON users.username = usersinroles.username
WHERE usersinroles.role = :role;

-- :name by-username-user-read :? :1
SELECT * FROM users
WHERE username = :username;

-- :name by-email-user-read :? :1
SELECT * FROM users
WHERE email = :email;

-- :name by-oauth-user-read :? :1
SELECT users.* FROM users
JOIN users_oauth ON users_oauth.username = users.username
WHERE users_oauth.oauth_id = :oauth_id;

-- :name user-create! :<! :1
-- :doc registers user with username & password
INSERT INTO users
(username, password, role)
VALUES (:username, :password, :role)
RETURNING *;

-- :name user-found? :? :n
SELECT CASE WHEN COUNT(username) = 0 THEN FALSE ELSE TRUE END FROM users
WHERE username = :username

-- :name user-role-insert! :<! :1
INSERT INTO usersinroles
(username, role)
VALUES (:username, :role)
RETURNING *;

-- :name login-update! :<! :1
UPDATE users
SET last_login = NOW(),
rev = rev + 1,
attempts = 0
WHERE username = :username
RETURNING *;

-- :name attempts-update! :<! :1
UPDATE users
SET attempts = attempts + 1,
rev = rev + 1
WHERE username = :username
RETURNING *;

-- :doc Roles
-- :name role-create! :<! :1
INSERT
INTO roles (role, description)
VALUES (:role, :description)
RETURNING *;

-- :name role-update! :<! :1
INSERT
INTO roles (role, description)
VALUES (:role, :description)
ON CONFLICT (role)
DO UPDATE SET
role = :role,
description = :description
WHERE roles.role = :role
RETURNING *;

-- :name role-delete! :! :n
DELETE
FROM roles
WHERE role = :role;

-- :name roles-read :? :*
SELECT *
FROM roles;

-- :name role-read :? :1
SELECT *
FROM roles
WHERE role = :role;

-- :name user-role-create! :<! :1
INSERT INTO usersinroles
(username, role) 
VALUES (:username, :role) 
ON CONFLICT DO NOTHING
RETURNING *;

-- :name by-username-user-roles-delete! :! :n
DELETE FROM usersinroles
WHERE username = :username;

-- :name by-username-user-role-delete! :! :n
DELETE FROM usersinroles
WHERE username = :username
AND role = :role;

-- :name by-username-user-roles-read :? :*
SELECT *
FROM usersinroles
WHERE username = :username;

-- :name by-user-oauth-create! :<! :1
INSERT INTO users
(username, email)
VALUES 
(:username, :username)
RETURNING *;

-- :name by-user-useroauth-create! :<! :1
INSERT INTO users_oauth
(username, oauth_id, oauth_type)
VALUES 
(:username, :sub, :iss)
RETURNING *;

-- :name by-user-userprofile-read :? :1
SELECT username, first_name, last_name FROM users_profile
WHERE username = :username;

-- :name by-user-userprofile-create! :<! :1
INSERT INTO users_profile
(username, first_name, last_name)
VALUES 
(:username, :first_name, :last_name)
RETURNING *;