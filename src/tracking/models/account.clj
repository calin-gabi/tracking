(ns tracking.models.account
  (:require
   [ak-dbg.core :refer :all]
   [buddy.hashers :as hashers]
   [tracking.core.config :as cfg]
   [tracking.models.token :as db-token]
   [buddy.sign.jwt :as jwt]
   [clojure.java.jdbc :as jdbc]
   [clojure.java.io :as io]
   [clojure.set :as set]
   [clojure.spec :as sp]
   [hugsql.core :as hugsql]
   [taoensso.timbre :as log]))

(hugsql/def-db-fns "tracking/sql/account.sql")

(defn savePicture! [uri file]
  (with-open [in (io/input-stream uri)
              out (io/output-stream file)]
    (io/copy in out)
    file))

(sp/def ::min-reg-profile (sp/keys :req-un [::username]))
(defn user-insert! [params]
  (if (sp/valid? ::min-reg-profile params)
    (jdbc/with-db-transaction [tx cfg/db]
                              (try
                                (let [users (count (users-read tx))
                                      role (if (> users 0)
                                             "user"
                                             "admin")
                                      passwords (:passwords params)
                                      passwordhash (if (some? passwords)
                                                     (-> (:password passwords)
                                                         (hashers/derive {:iterations 10 :limit cfg/trusted-algs}))
                                                     "")
                                      sel {:username (:username params) :password passwordhash :role role}
                                      user_ (user-create! tx sel)
                                      role_ (user-role-insert! tx {:username (:username user_) :role role})
                                      profile (by-user-userprofile-create! tx params)
                                      picture_url (if (some? (:picture_url params))
                                                    (let [root (.getCanonicalPath (clojure.java.io/file "."))
                                                          filepath (str root "/resources/public/content/" (:id profile) "/profilePicture.jpg")
                                                          dirs (io/make-parents filepath)
                                                          file (savePicture! (:picture_url params) filepath)]
                                                      file)
                                                    "")]
                                  {:stat :ok})
                                (catch Exception ex
                                  (jdbc/db-set-rollback-only! tx)
                                  (log/error (.getMessage ex))
                                  {:stat :err :msg "DB error"})))
    {:stat :err :msg "user create error"}))

;; #### OAUTH
(defn oauth-check [params]
  (dbg params)
  (let [user-oauth (by-user-oauth-read cfg/db params)
        user_o (if (some? user-oauth)
                 user-oauth
                 (by-user-useroauth-create! cfg/db params))
        res (if (some? user_o)
              (let [profile (by-user-userprofile-read cfg/db params)
                    roles (by-username-user-roles-read cfg/db params)
                    token (:res (db-token/token-create! (:username params) roles))
                    profile* (assoc profile :roles roles :token token)]
                profile*)
              ({:stat :err :res "Oauth error!"}))]
    res))

(defn oauth-submit [params]
  (let [username (:username params)
        user (by-username-user-read cfg/db {:username username})
        res (if (some? user)
              (oauth-check params)
              (let [inserted (user-insert! params)
                    profile (if (= (:stat inserted) :ok)
                              (oauth-check params)
                              {:stat :err :msg "DB error"})]
                profile))]
    res))

(defn oauth-get [params]
  (let [oauth-id (:sub params)
        user (by-oauth-user-read cfg/db {:oauth_id oauth-id})]
    (if (= user nil)
      (let [username (:username user)
            roles (->> {:username username}
                       (by-username-user-roles-read cfg/db)
                       (map :role))
            userprofile (by-user-userprofile-read cfg/db {:username username})
            db-user* (assoc user :roles roles :profile userprofile)]
        {:user (select-keys db-user* [:username :roles :profile])
         :token (:res (db-token/token-create! (dbg username) (dbg roles)))})
      {:user user :res params})))

(defn oauth-set! [params]
  (let [user (by-user-userprofile-read params)
        user* (if (some? user)
                user
                (jdbc/with-db-transaction [tx cfg/db]
                                          (try
                                            (let [user_ (by-user-oauth-create! tx params)
                                                  useroauth (by-user-useroauth-create! tx params)
                                                  userprofile (by-user-userprofile-create! tx params)
                                                  userroles (user-role-insert! tx {:username (:username params) :role "user"})]
                                              userprofile)
                                            (catch Exception ex
                                              (log/error (.getMessage ex))
                                              (jdbc/db-set-rollback-only! tx)
                                              {:stat :err}))))]
    (if (= user* nil)
      {:user user* :res params}
      {:user user* :res user})))
