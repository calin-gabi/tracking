(ns tracking.ctrl.index
  (:require
   [ak-dbg.core :refer :all]
   [cheshire.core :as json]
   [environ.core :refer [env]]
   [hiccup.page :refer [html5]]
   [compojure.core :refer [context defroutes GET POST]]
   [ring.util.response :refer [response content-type]]))


;; #### PAGES
(defn page [{:keys [] :as req}]
  (html5
   {:lang "en"}

   [:head
    [:base {:href "/"}]
    [:meta {:charset "utf-8"}]
    [:meta {:name "viewport" :content "width=device-width, initial-scale=1.0"}]
    [:meta {:http-equiv "X-UA-Compatible" :content "IE=edge"}]
    [:title "tracking"]
    [:link {:rel "stylesheet" :href "/node_modules/bootstrap/dist/css/bootstrap.min.css"} ]
    [:link {:rel "stylesheet" :href "/css/main.css"} ]
    [:link {:rel "stylesheet" :href "/fonts/font-awesome-4.7.0/css/font-awesome.min.css?v=1234"} ]
    [:script {:src "/node_modules/core-js/client/shim.min.js"}]
    [:script {:src "/node_modules/zone.js/dist/zone.js"}]
    [:script {:src "/node_modules/reflect-metadata/Reflect.js"}]
    [:script {:src "/node_modules/systemjs/dist/system.src.js"}]
    [:script {:src "/js/systemjs.config.js"}]
    [:script "System.import('app/core/boot').catch(function(err){console.error(err);});"]]
    #_[:script {:src "/js/dist/cached_uglify/cached_uglify/main.bundle.4075a08db6f680f09bc038f22b073fd9455ffc52.js"}]

   [:body
    [:script {:src "/node_modules/jquery/dist/jquery.min.js"}]
    [:script {:src "/node_modules/bootstrap/dist/js/bootstrap.min.js"}]
    [:script {:src "/node_modules/moment/min/moment.min.js"}]
    [:main
     (if (= (:dev env) "true")
       {:class "dev"})
     "Loading..."]]))

(defn index-page [{:keys [session] :as req}]
  (let []
    (-> req
        (page)
        (response)
        (content-type "text/html; charset=utf-8"))))

(defn request-to-keywords [{:keys [headers] :as req}]
  (into {} (for [[_ k v] (re-seq #"([^&=]+)=([^&]+)" (:referer req))]
    [(keyword k) v])))

;; #### ROUTES
(defroutes index-routes
  (GET "/" req (index-page req))
  (GET "/home" req (index-page req))
  (GET "/login" req (index-page req))
  (GET "/logout" req (index-page req))
  (GET "/register" req (index-page req))
  (GET "/oauth2callback" req (index-page req))
  (GET "/404" req "404: Page not found."))
