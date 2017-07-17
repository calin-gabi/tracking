(defproject test "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies
  [[buddy "1.2.0"]
 [cheshire "5.6.3"]
 [clj-http "3.4.1"]
 [clj-time "0.12.2"]
 [clj-pdf "2.2.12"]
 [com.draines/postal "2.0.2"]
 [com.layerware/hugsql-core "0.4.7"]
 [com.layerware/hugsql-adapter-clojure-java-jdbc "0.4.7"]
 [com.taoensso/encore "2.87.0"]
 [com.taoensso/nippy "2.12.2"]
 [com.taoensso/timbre "4.7.4"]
 [compojure "1.5.1"]
 [de.kolov/ak-checker "0.1.0"]
 [de.kolov/ak-dbg "0.2.3"]
 [de.kolov/ak-request "0.2.2"]
 [environ "1.1.0"]
 [funcool/cuerdas "2.0.1"]
 [hiccup "1.0.5"]
 [http-kit "2.2.0"]
 [manifold "0.1.5"]
 [me.raynes/fs "1.4.6"]
 [migratus "0.8.32"]
 [mpg "1.3.0"]
 [mvxcvi/puget "1.0.1"]
 [org.clojure/clojure "1.9.0-alpha14"]
 [org.clojure/data.csv "0.1.3"]
 [org.clojure/java.jdbc "0.6.2-alpha3"]
 [org.postgresql/postgresql "9.4.1212"]
 [ring-middleware-format "0.7.0"
  :exclusions [org.clojure/java.classpath]]
 [ring/ring-defaults "0.2.1"]
 [ring/ring-devel "1.5.0"]
 [ring/ring-core "1.5.0"]
 [selmer "1.10.5"]
 [markdown-clj "0.9.91"]]

:plugins [[migratus-lein "0.4.1"]
          [lein-scss "0.3.0"]]

:main ^:skip-aot tracking.core.boot

:migratus {:store :database
           :migration-dir "migrations"
           :db (str "jdbc:postgres://localhost"
                    "/tracking"
                    "?user=sa"
                    "&password=2vE7kG4fG.@w9T")}
:scss {:builds
       {:dev {:source-dir "src/tracking/scss/"
              :dest-dir "resources/public/css/"
              :executable "sassc"
              :args ["-m" "-I" "scss/" "-t" "compressed"]}}}

:ring {:handler tracking.core.boot/app}

:target-path "target/%s"

:profiles {:uberjar {:aot :all}
           :pre {:env {:prod "false"
                       :port 3016
                       :db-url (str "jdbc:postgres://localhost"
                                    "/tracking"
                                    "?user=sa"
                                    "&password=2vE7kG4fG.@w9T")}}})
