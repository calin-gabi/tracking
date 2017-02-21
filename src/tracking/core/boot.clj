(ns tracking.core.boot
  (:require
   [ak-dbg.core :refer :all]
   [compojure.core :refer [defroutes routes GET POST]]
   [compojure.route :as route]
   [tracking.ctrl.index :refer [index-routes]]
   [tracking.ctrl.middleware :as c-mid]
   [tracking.ctrl.template :refer [template-routes]]
   [tracking.ctrl.account :refer [account-routes]]
   [tracking.ctrl.tracking :refer [tracking-routes]]
   [tracking.ctrl.token :refer [token-routes]]
   [tracking.ctrl.reports :refer [reports-routes]]
   [tracking.ctrl.smtp :refer [smtp-routes]]
   [cuerdas.core :as str]
   [environ.core :refer [env]]
   [hugsql.core :as hugsql]
   [hugsql.adapter.clojure-java-jdbc :as cj-adapter]
   [org.httpkit.server :as kit]
   [taoensso.timbre :as log]
   [taoensso.timbre.appenders.3rd-party.rotor :as rotor]
   [ring.middleware.reload :as reload])
  (:gen-class))

(require 'tracking.tmpl.account.account)
(require 'tracking.tmpl.home.home)

(defroutes base-routes
  (route/resources "/")
  (route/not-found "<p>Page unfortunately not found.</p>"))

(def app (reload/wrap-reload
          (-> (routes index-routes tracking-routes template-routes smtp-routes account-routes token-routes reports-routes base-routes)
              (c-mid/middleware))))
              
(defn init [args]
  (let [port (some-> args
                     (second)
                     (Integer/parseInt))
        port* (or port 3016)]

   (log/merge-config!
    {:level :info
     :appenders {:rotor (rotor/rotor-appender {:path "tracking.log"
                                               :max-size (* 512 1024)
                                               :backlog 10})}
     :ns-blacklist []
     :timestamp-opts {:locale (java.util.Locale/ENGLISH)}})

   (kit/run-server #'app {:port port* :max-line (* 1024 16)})

   (hugsql/set-adapter! (cj-adapter/hugsql-adapter-clojure-java-jdbc))

   (log/info "tracking started successfully on port" port*)))

(defn -main [& args]
  (init args))
