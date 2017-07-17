-- :name tracking-read :? :*
SELECT * FROM tracking

-- :name by-id-track-read :? :1
SELECT * FROM tracking
WHERE id = :id;

-- :name by-username-tracking-read :? :*
SELECT *, to_char(time, 'HH24:MI') as _time FROM tracking
WHERE username = :username
ORDER BY date DESC;

-- :name by-username-tracking-report :? :*
SELECT to_char(date, 'DD MM YYYY') as date_str, to_char(time, 'HH24:MI') as time_str,
to_char(amount, '99999') as amount_str, to_char(amount/(extract(hour from time) + extract(minute from time) / 60.0), '99.99 km/h') as avgsp,
extract(week from date) as week, extract(year from date) as year, amount FROM tracking
WHERE username = :username AND
replace(to_char(extract(year from date), '9999') || '-W' || to_char(extract(week from date), '09'), ' ', '') = :week;

-- :name by-username-trackingAggregate-report :? :1
Select EXTRACT (EPOCH FROM SUM(time))::int as totalTime, SUM(amount) as totalDistance from tracking
WHERE username = :username AND
replace(to_char(extract(year from date), '9999') || '-W' || to_char(extract(week from date), '09'), ' ', '') = :week;

-- :name track-upsert! :<! :1
/*~ (if (= (:id params) 0) */
INSERT INTO tracking(username, date, time, description, amount, comment)
VALUES (:username, to_date(:date, 'YYYY-MM-DD'), TO_TIMESTAMP(:time, 'HH24:MI')::TIME, :description, :amount, :comment)
RETURNING *, to_char(time, 'HH24:MI') as _time;
/*~*/
UPDATE tracking SET
username = :username, date = to_date(:date, 'YYYY-MM-DD'), time = TO_TIMESTAMP(:time, 'HH24:MI')::TIME, description = :description, amount = :amount, comment = :comment
WHERE tracking.id = :id
RETURNING *, to_char(time, 'HH24:MI') as _time;
/*~ ) ~*/

-- :name by-id-track-del! :! :*
DELETE FROM tracking
WHERE id = :id;
