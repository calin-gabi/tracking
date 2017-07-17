CREATE TABLE IF NOT EXISTS tracking (
  id SERIAL PRIMARY KEY,
  username VARCHAR (200) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  date DATE default CURRENT_DATE,
  time TIME default now(),
  description VARCHAR(500),
  amount REAL,
  comment VARCHAR(500),
  rev INT NOT NULL DEFAULT 0
);
