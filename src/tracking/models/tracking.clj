(ns tracking.models.tracking
  (:require
   [ak-checker.core :refer [ok?]]
   [ak-dbg.core :refer :all]
   [ak-request.core :as ak-request]
   [cheshire.core :as json]
   [clj-http.client :as http]
   [clojure.java.jdbc :as jdbc]
   [clojure.java.io :as cio]
   [cuerdas.core :as str]
   [tracking.core.config :as cfg]
   [hugsql.core :as hugsql]
   [taoensso.timbre :as log]))

(hugsql/def-db-fns "tracking/sql/tracking.sql")

(defn by-username-tracking-get [{:keys [params identity] :as req}]
  (let [user-exp (:username params)
        user (:username identity)
        role (:role identity)
        res (if (or (= user-exp user) (= role "admin"))
              {:stat :ok :res (by-username-tracking-read cfg/db {:username user-exp})}
              {:stat :err :res []})]
    (dbg res)))

(defn tracking-upsert! [{:keys [params identity] :as req}]
  (let [user-exp (:username (dbg params))
        track (:track params)
        user (dbg (:username identity))
        role (:role identity)
        res (if (or (dbg (= user-exp user)) (= role "admin"))
              (let [track_ (track-upsert! cfg/db track)]
                {:stat :ok :res (dbg track_)})
              {:stat :err})]
    (dbg res)))

(defn tracking-upsertbulk! [{:keys [params identity] :as req}]
  (let [user-exp (:username (dbg params))
        tracks (:track params)
        user (dbg (:username identity))
        role (:role identity)
        res (if (or (dbg (= user-exp user)) (= role "admin"))
              (let [tracks_ (map #(track-upsert! cfg/db (dbg %)) tracks)]
                {:stat :ok :res (dbg tracks_)})
              {:stat :err})]
    (dbg res)))

(defn tracking-del! [{:keys [params identity] :as req}]
  (let [id (Integer/parseInt (re-find #"\A-?\d+" (:id params)))
        track-entry (dbg (by-id-track-read cfg/db {:id id}))
        user-exp (:username track-entry)
        user (:username identity)
        role (:role identity)
        res (if (or (= user-exp user) (= role "admin"))
              {:stat :ok :res (by-id-track-del! cfg/db {:id id})}
              {:stat :err :res []})]
    res))

(defn tracking-report [username week year]
  (let [res (by-username-tracking-report cfg/db (dbg {:username username :week week :year year}))]
    (dbg res)))
