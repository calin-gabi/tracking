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
        res))

(defn tracking-upsert! [{:keys [params identity] :as req}]
 (dbg req)
  (let [user-exp (dbg (:username (:expense params)))
        user (dbg (:username identity))
        role (:role identity)
        res (if (or (dbg (= user-exp user)) (= role "admin"))
             {:stat :ok :res (expense-upsert! cfg/db (:expense params))}
              {:stat :err :res []})]
        res))

(defn tracking-del! [{:keys [params identity] :as req}]
  (let [user-exp (:username (:expense params))
        user (:username identity)
        role (:role identity)
        res (if (or (= user-exp user) (= role "admin"))
              {:stat :ok :res (by-id-expense-del! cfg/db (:expense params))}
              {:stat :err :res []})]
        res))

(defn tracking-report [username week year]
  (let [res (by-username-tracking-report cfg/db {:username username :week week :year year})]
      res))