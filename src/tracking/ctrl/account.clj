(ns tracking.ctrl.account
  (:require
   [ak-checker.core :refer [ok?]]
   [ak-dbg.core :refer :all]
   [ak-request.core :as ak-request]
   [buddy.hashers :as hashers]
   [cheshire.core :as json]
   [clojure.java.jdbc :as jdbc]
   [clojure.java.io :as cio]
   [clojure.spec :as sp]
   [cuerdas.core :as str]
   [compojure.core :refer [context defroutes GET POST]]
   [tracking.core.config :as cfg]
   [tracking.models.account :as db-account]
   [tracking.models.token :as db-token]
   [hugsql.core :as hugsql]
   [mpg.core :as mpg]
   [ring.util.response :as response]
   [taoensso.nippy :as nippy]
   [taoensso.timbre :as log]))

(hugsql/def-db-fns "tracking/sql/account.sql")

;; #### API
(defn user-exists? [{:keys [params] :as req}]
  (json/generate-string
   (let [username (str/lower (:username params))]
    (if (> (count username) 0)
      (if (:case (user-found? cfg/db {:username username}))
        {:stat :ok :res username :msg "User exists"}
        {:stat :ok :res nil :msg "User not found"})
      {:stat :err :msg "Username not valid"}))))

(sp/def ::min-reg-profile (sp/keys :req-un [::passwords ::username]))

(defn register! [{:keys [params] :as req}]
  (json/generate-string 
    (if (sp/valid? ::min-reg-profile params)
      (jdbc/with-db-transaction [tx cfg/db]
        (try
          (let [password (:password (:passwords params))
                passwordhash (-> password
                                  (hashers/derive {:iterations 10 :limit cfg/trusted-algs}))
                users (count (users-read tx))
                role (if (> users 0)
                        "user"
                        "admin")
                user {:username (:username params) :password passwordhash :role role}
                user_ (user-create! tx user)
                role_ (user-role-insert! tx {:username (:username user_) :role role})
                res :ok]
              {:stat res})
          (catch Exception ex
            (jdbc/db-set-rollback-only! tx)
            (log/error (.getMessage ex))
            {:stat :err :msg "DB error"})))
      {:stat :err :msg "user create error"})))

(sp/def ::min-login (sp/keys :req-un [::password ::username]))

(defn login [{:keys [params] :as req}]
  (json/generate-string
    (if (sp/valid? ::min-login params)
      (jdbc/with-db-transaction [tx cfg/db]
        (try
          (let [username (str/lower (:username params))
                password (:password params)
                db-user (by-username-user-read tx {:username username})]

            (if db-user
              ;; ## User found
              (if (hashers/check password (:password db-user))
                ;; # Correct creds
                (do
                  (login-update! tx {:username username})
                  {:stat :ok :res {:user (select-keys db-user [:username :role])
                                    :token (:res (db-token/token-create! username (:role db-user)))}})
                ;; # Wrong creds
                (do
                  (attempts-update! tx {:username username})
                  {:stat :err :msg "Wrong credentials"}))
              ;; ## User not found
              {:stat :err :msg "User not found"}))

          (catch Exception ex
            (jdbc/db-set-rollback-only! tx)
            (log/error (.getMessage ex))
            {:stat :err :msg "DB error"})))

      {:stat :err :msg "Insufficient data"})))  

(defn logout! [{:keys [params] :as req}]
  (json/generate-string
   (let [res (db-token/token-remove! (:token params))]
     {:stat :ok}))) 

(defn users-get [{:keys [params] :as req}]
  (json/generate-string
   (let [username (:username params)
          user (by-username-user-read cfg/db {:username username})
          res (users-data-read cfg/db)]
     {:stat :ok :res res})))

(defn user-del! [{:keys [params] :as req}]
  (json/generate-string
   (let [username (:username params)
          res (user-delete! cfg/db {:username username})]
     {:stat :ok})))

(defn user-role-set! [{:keys [params] :as req}]
 (dbg params)
  (json/generate-string
   (let [res (user-upd-role! cfg/db params)]
     {:stat :ok})))

           
;; #### ROUTES
(defroutes account-routes
  (GET "/userexists/:username" req (user-exists? req))
  (POST "/register" req (register! req))
  (POST "/login" req (login req))
  (POST "/logout" req (logout! req))
  (context "/users" [req]
    (POST "/" req (users-get req))
    (POST "/delete" req (user-del! req))
    (POST "/role" req (user-role-set! req))))