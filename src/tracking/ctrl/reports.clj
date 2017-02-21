(ns tracking.ctrl.reports
  (:require    
    [ak-dbg.core :refer :all]
    [clj-pdf.core :refer [pdf template]]
    [tracking.models.tracking :as db-reports]
    [cheshire.core :as json]
    [compojure.core :refer [context defroutes GET POST]]
    [tracking.core.config :as cfg]
    [tracking.models.tracking :as db-tracking]
    [hiccup.element :refer [link-to]]
    [ring.util.response :as response]
    [taoensso.nippy :as nippy]
    [taoensso.timbre :as log]))

(def week-tracking-template
  (template [$date_str $time_str $description $amount_str $comment]))


(defn tracking-report [{:keys [params] :as req}]
 (dbg params)
 (let [username (:username params)
        week (:week params)
        year (:year params)
        out (:out params)
        table (db-reports/tracking-report username week year)
        total (apply + (map :amount table))
        average (if (> (count table) 0)
                    (format "%.2f" (/ total 7))
                    0)
        total-line (str "Total tracking : " total)
        average-line (str "Average per day : " average)
        res (pdf
                [{:header (str "tracking List for user " username " in week " week " of year " year) }
                (if (> (count table) 0)
                    (into [:table {:border false
                                :cell-border false
                                :header [{:color [0 150 150]} "Date" "Time" "Description" "Amount" "Comment"]}] 
                        (week-tracking-template table))
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