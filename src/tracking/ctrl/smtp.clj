(ns tracking.ctrl.smtp
  (:require
    [ak-checker.core :refer [ok?]]
    [ak-dbg.core :refer :all]
    [hiccup.page :refer [html5]]
    [postal.message   :as msg]
    [postal.core :refer [send-message]]
    [cheshire.core :as json]
    [compojure.core :refer [context defroutes GET POST]]
    [tracking.core.config :as cfg]
    [taoensso.nippy :as nippy]
    [taoensso.timbre :as log]))

(defn Hello [params]
  (html5
    [:body
      [:div
        {:style "width: 320px; height:160px; background-color: gray"}
        [:svg
          {:width "325"
            :height "160"
            :xmlns "http://www.w3.org/2000/svg"}
          [:circle
            {:cx "80"
              :cy "80"
              :r "50"
              :fill "white"}]
          [:circle
            {:cx "80"
              :cy "80"
              :r "32"
              :fill "#605E5E"}]
          [:path
            {:d "M80 60
                A 20 20, 0, 0, 1, 80 100
                L 80 100 Z"
            :fill "#70E0AC"}]
          [:circle
            {:cx "80"
              :cy "80"
              :r "12"
              :fill "#605E5E"}]]
        [:h3
          {:style "color: yellow"}
            (str "Hello " (:name params))]]]))

(defn send-email [{:keys [params] :as req}]
  (json/generate-string
    (try
      (let [content (Hello {:name (:name params)})
            params_ (assoc params :body [{:type "text/html" :content content}])
            res  (send-message cfg/smtp params_)]
            {:stat :ok :res (dbg res)})
        (catch Exception ex
        (log/error (.getMessage ex))
            {:stat :err :msg "send error"}))))

;; #### ROUTES
(defroutes smtp-routes
  (POST "/smtp/send" req (send-email req)))
