(ns tracking.ctrl.tracking
  (:require
    [ak-checker.core :refer [ok?]]
    [ak-dbg.core :refer :all]
    [postal.message   :as msg]
    [postal.core :refer [send-message]]
    [cheshire.core :as json]
    [compojure.core :refer [context defroutes GET POST DELETE]]
    [tracking.core.config :as cfg]
    [tracking.models.tracking :as db-tracking]
    [taoensso.nippy :as nippy]
    [taoensso.timbre :as log]))

(defn by-username-tracking-get [req]
  (json/generate-string
    (db-tracking/by-username-tracking-get req)))

(defn tracking-upsert! [req]
  (json/generate-string
    (db-tracking/tracking-upsert! req)))

(defn tracking-upsertbulk! [req]
  (json/generate-string
    (db-tracking/tracking-upsertbulk! req)))

(defn tracking-del! [req]
  (json/generate-string
    (db-tracking/tracking-del! req)))

;; #### ROUTES
(defroutes tracking-routes
  (context "/tracking" [req]
    (GET "/" req (by-username-tracking-get req))
    (POST "/save" req (tracking-upsert! req))
    (POST "/savebulk" req (tracking-upsertbulk! req))
    (DELETE "/del" req (tracking-del! req))))
