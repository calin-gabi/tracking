-- :name tracking-read :? :*
SELECT * FROM tracking

-- :name by-username-tracking-read :? :*
SELECT * FROM tracking
WHERE username = :username;

-- :name by-username-tracking-report :? :*
SELECT to_char(date, 'DD MM YYYY') as date_str, to_char(time, 'HH:mm') as time_str, 
description, to_char(amount, '99999') as amount_str, comment, 
extract(week from date) as week, extract(year from date) as year, amount FROM tracking
WHERE username = :username AND extract(week from date) = :week AND extract(year from date) = :year;

-- :name expense-upsert! :<! :1
/*~ (if (= (:id params) 0) */
INSERT INTO tracking(username, date, time, description, amount, comment)
VALUES (:username, to_date(:date, 'YYYY-MM-DD'), TO_TIMESTAMP(:time, 'HH24:MI')::TIME, :description, :amount, :comment)
RETURNING *;
/*~*/
UPDATE tracking SET 
username = :username, date = to_date(:date, 'YYYY-MM-DD'), time = TO_TIMESTAMP(:time, 'HH24:MI')::TIME, description = :description, amount = :amount, comment = :comment
WHERE tracking.id = :id
RETURNING *;
/*~ ) ~*/

-- :name by-id-expense-del! :! :*
DELETE FROM tracking
WHERE id = :id;