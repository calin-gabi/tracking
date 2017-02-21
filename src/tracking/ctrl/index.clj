(ns tracking.ctrl.index
  (:require
   [ak-dbg.core :refer :all]
   [cheshire.core :as json]
   [compojure.core :refer [context defroutes GET POST]]
   [tracking.tmpl.core.core :as t-core]
   [ring.util.response :refer [response content-type]]))

;; #### PAGES
(defn index-page [{:keys [session] :as req}]
  (let []
    (-> req
        (t-core/page)
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
  (GET "/register" req (index-page req))
  (GET "/registerconfirmation" req (index-page req))
  (GET "/emailconfirmation" req (index-page req))
  (GET "/404" req "404: Page not found."))
