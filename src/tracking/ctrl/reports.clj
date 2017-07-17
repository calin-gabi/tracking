(ns tracking.ctrl.reports
  (:require
    [ak-dbg.core :refer :all]
    [clj-pdf.core :refer [pdf template]]
    [tracking.models.tracking :as db-tracking]
    [cheshire.core :as json]
    [compojure.core :refer [context defroutes GET POST]]
    [tracking.core.config :as cfg]
    [tracking.models.tracking :as db-tracking]
    [hiccup.element :refer [link-to]]
    [ring.util.response :as response]
    [taoensso.nippy :as nippy]
    [hugsql.core :as hugsql]
    [taoensso.timbre :as log]))

  (hugsql/def-db-fns "tracking/sql/tracking.sql")

(def week-tracking-template
  (template [$date_str $time_str $amount_str $avgsp]))


(defn tracking-report [{:keys [params] :as req}]
 (dbg params)
 (let [username (:username params)
        week (:week params)
        year (:year params)
        out (:out params)
        table (db-tracking/tracking-report username week year)
        aggregate (dbg (by-username-trackingAggregate-report cfg/db {:username username :week week}))
        totalTime (or (:totaltime aggregate) 0)
        totalDistance (or (:totaldistance aggregate) 0)
        avgSpeed (if (> totalTime 0)
                    (format "%.2f" (/ (* totalDistance 3600) totalTime))
                    "not available")
        total-line (str "Total distance : " totalDistance " km")
        average-line (str "Average speed : " avgSpeed " km/h")
        res (pdf
                [{:header (str "tracking List for user " username " in week " week " of year " year) }
                (if (> (count table) 0)
                    (into [:table {:border false
                                :cell-border false
                                :header [{:color [0 150 150]} "Date" "Time(hh:mm)" "Distance(km)" "Avg speed(km/h)"]}]
                        (week-tracking-template (dbg table)))
                    [:chunk "No tracking in this period"])
                [:line]
                [:spacer]
                [:chunk total-line]
                [:spacer]
                [:chunk average-line]]
                    out)]
    {:stat :ok :res true}))

(defn write-response [report-bytes]
  (with-open [in (java.io.ByteArrayInputStream. report-bytes)]
    (-> (response/response in)
        (response/header "Content-Disposition" "filename=document.pdf")
        (response/header "Content-Length" (count report-bytes))
        (response/content-type "application/pdf")) ))

(defn generate-report [report-type]
 (try
  (let [out (new java.io.ByteArrayOutputStream)]
       (condp = (keyword report-type)
         :table (dbg (tracking-report "gabriel" 2 2017 out)))
       (write-response (.toByteArray out)))
  (catch Exception ex
    {:status 500
     :headers {"Content-Type" "text/html"}
     :body {}})))

(defroutes reports-routes
  (POST "/reports/tracking" req (tracking-report req)))
