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
   [clojure.walk :as walk]
   [cuerdas.core :as str]
   [compojure.core :refer [context defroutes GET POST DELETE]]
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

(sp/def ::min-login (sp/keys :req-un [::password ::username]))

(defn login [{:keys [identity] :as req}]
  (dbg req)
  (json/generate-string
   (jdbc/with-db-transaction [tx cfg/db]
                             (try
                               (let [username (str/lower (:username (dbg identity)))
                                     db-user (dbg (by-username-user-read tx {:username username}))]

                                 (if db-user
             ;; ## User found
                                   (do
                                     (login-update! tx {:username username})
                                     (let [userprofile (dbg (by-user-userprofile-read tx  {:username username}))]
                                       {:stat :ok :res {:user (select-keys db-user [:username :role]) :userprofile userprofile
                                                        :token (:res (db-token/token-create! username (:role db-user)))}}))
             ;; ## User not found
                                   {:stat :err :msg "User not found"}))

                               (catch Exception ex
                                 (jdbc/db-set-rollback-only! tx)
                                 (log/error (.getMessage ex))
                                 {:stat :err :msg "DB error"})))))

(defn register! [{:keys [params identity headers] :as req}]
  (dbg req)
  (json/generate-string
   (let [origin (dbg (:origin (walk/keywordize-keys headers)))
         host_ (dbg (:host (walk/keywordize-keys headers)))
         host (dbg (if (= (:scheme req) :http)
                     (str "http://" host_)
                     (str "https://" host_)))
         res (if (or (= origin host) (.contains ["admin" "manager" "user"] (:role identity)))
               (let [inserted (db-account/user-insert! params)
                     result (if (= origin host)
                              (json/parse-string (login {:identity {:username (:username params) :password (:password (:passwords params))}}))
                              inserted)]
                 result)
               {:stat :err :msg "Not authorized"})]
     res)))

(defn logout! [{:keys [params] :as req}]
  (json/generate-string
   (let [res (db-token/token-remove! (:token params))]
     {:stat :ok})))

(defn oauth-submit [{:keys [params] :as req}]
  (json/generate-string
   (let [res (db-account/oauth-submit params)]
     {:stat :ok :res res})))

(defn users-get [{:keys [params] :as req}]
  (json/generate-string
   (let [username (:username params)
         user (by-username-user-read cfg/db {:username username})
         res (users-data-read cfg/db)]
     {:stat :ok :res res})))

(defn user-del! [{:keys [params] :as req}]
  (json/generate-string
   (let [username (:username params)
         user (by-username-user-read cfg/db {:username username})
         res (if (and (= (:role user) "admin") (not (= (:role identity) "admin")))
               "Not authorized"
               (user-delete! cfg/db params))]
     {:stat :ok :res res})))

(defn user-role-set! [{:keys [params identity] :as req}]
  (json/generate-string
   (let [username (:username params)
         user (by-username-user-read cfg/db {:username username})
         res (if (and (= (:role user) "admin") (not (= (:role identity) "admin")))
               "Not authorized"
               (user-upd-role! cfg/db params))]
     {:stat :ok :res res})))

;; #### ROUTES
(defroutes account-routes
           (GET "/userexists/:username" req (user-exists? req))
           (POST "/register" req (register! req))
           (POST "/login" req (login req))
           (POST "/logout" req (logout! req))
           (context "/users" [req]
                    (GET "/" req (users-get req))
                    (DELETE "/delete" req (user-del! req))
                    (POST "/role" req (user-role-set! req))))
