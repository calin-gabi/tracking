(ns tracking.ctrl.middleware
  (:require
   [ak-checker.core :refer [ok?]]
   [ak-dbg.core :refer :all]
   [ak-request.core :as ak-request]
   [buddy.auth :refer [authenticated?]]
   [buddy.auth.accessrules :refer [wrap-access-rules] :as rules]
   [buddy.auth.backends :as backends]
   [buddy.hashers :as hashers]
   [buddy.auth.middleware :refer [wrap-authentication]]
   [cheshire.core :as json]
   [compojure.core :refer [defroutes routes GET POST]]
   [tracking.core.config :as cfg]
   [tracking.models.token :as db-token]
   [tracking.ctrl.account :as db-account]
   [hugsql.core :as hugsql]
   [ring.middleware.defaults :refer [site-defaults api-defaults wrap-defaults]]
   [ring.middleware.format-params :refer [wrap-restful-params]]
   [ring.middleware.keyword-params :refer [wrap-keyword-params]]
   [ring.middleware.params :refer [wrap-params assoc-form-params]]
   [ring.util.response :refer (response)]
   [taoensso.timbre :as log]))

(hugsql/def-db-fns "tracking/sql/account.sql")

(def ring-defaults*
  (merge site-defaults

         {:params {:keywordize true
                   :multipart true
                   :nested true
                   :urlencoded true}}

         {:static {:resources false}}

         {:session {:cookie-attrs {:max-age 604800}
                    :cookie-name "session"}}

         {:security {:anti-forgery false}}))

;; #### AUTH
;; ## Authentication
(defn token-expand [req token]
  (let [res (db-token/identity-get token)]
   (or res false)))

(defn basic-auth [req authdata]
  (let [db-user (by-username-user-read cfg/db authdata)
        res (if (hashers/check (:password authdata) (:password db-user))
              {:username (:username db-user) :role (:role db-user)}
              false)]
       res))

(def backend (backends/token {:authfn token-expand}))

(def backend-basic (backends/basic {:authfn basic-auth}))

;; ## Authorization
(defn users? [{:keys [identity] :as req}]
  (if (dbg (.contains [ "admin" "manager"] (:role identity)))
    (rules/success)
    (rules/error "Not authorized")))

(defn tracking? [{:keys [identity] :as req}]
  (if (.contains [ "admin" ] (:role identity))
    (rules/success)
    (rules/error "Not authorized")))

(def rules
  [{:uri "/users*"
    :handler users?}

    #_{:uri "/tracking/*"
    :handler tracking?}])

(defn on-error [req value]
  {:status 403
   :headers {}
   :body "Not authorized"})

;; #### MIDDLEWARE
(defn middleware [handler]
  (-> handler
      (wrap-keyword-params)
      (wrap-restful-params)
      (wrap-access-rules {:rules rules :on-error on-error})
      (wrap-authentication backend backend-basic)
      (wrap-defaults ring-defaults*)))
