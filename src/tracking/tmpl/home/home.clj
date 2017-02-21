(ns tracking.tmpl.home.home
  (:require
   [ak-dbg.core :refer :all]
   [tracking.ctrl.template :refer [template response-wrap]]))

(defmethod template "home" [{:keys [] :as req}]
  (response-wrap
   [:div#home
    [:div#navigation.container-fluid
      [:div.col-md-4
        {"*ngIf" "state.cred"}
        "Hi {{state.cred.username}}, welcome to tracking app!"]
      [:div.col-md-4
        "Selected user {{user}}"]
      [:div.col-md-2
        [:a {"routerLink" "/logout"} "Logout"]]]
    [:div#content.container-fluid
      [:div.tracking.col-md-9
        [:div.filter-header.container-fluid
          [:div.col-lg-2 "tracking"]
          [:span.col-lg-2 "Type text to filter"]
          [:input.col-lg-2 
            {"[ngModel]" "filter"
            "(ngModelChange)" "filtertracking($event)"}]]
        [:div.header-report.container
            [:span.col-lg-2 "Select week"]
            [:input.week.col-lg-2
              {"[(ngModel)]" "week"}]
            [:span.col-lg-2 " and year"]
            [:input.year.col-lg-2
              {"[(ngModel)]" "year"}]
            [:button.col-lg-2
              {"(click)" "reporttracking()"}
              "Report"
              [:i.fa.fa-print]]
            [:a#downloadlink.col-lg-2.btn
              {:href "/tracking-report.pdf"
               :target "_blank"}
              [:i.fa.fa-download "  Download report"]]]
        [:div.header.inline
          [:div.left.date
            "Date"]
          [:div.left.time
            "Time"]
          [:div.left.description
            "Description"]
          [:div.left.amount
            "Amount"]
          [:div.left.comment
            "Comment"]
          [:button.btn
            {"(click)" "addExpense()"
             :title "click to add expense"}
            [:i.right.fa.fa-plus
              "  add expense"]]]
        [:div.content
          [:div.expense
            {"*ngFor" "let expense of tracking_filtered"}
            [:div.inline
              [:div.left.date
                [:input
                  {"[(ngModel)]" "expense.date"
                   :type "date"
                   :placeholder "MM/dd/yyyy"}]]
              [:div.left.time
                [:input 
                  {"[(ngModel)]" "expense.time"
                   :type "time"
                   :placeholder "HH:mm"}]]
              [:div.left.description
                [:input 
                  {"[(ngModel)]" "expense.description"
                   :type "text"
                   :placeholder "description"}]]
              [:div.left.amount
                [:input 
                  {"[(ngModel)]" "expense.amount"
                   :type "number"
                   :min 0
                   :placeholder "amount"}]]
              [:div.left.comment
                [:input 
                  {"[(ngModel)]" "expense.comment"
                   :type "text"
                   :placeholder "comment"}]]
              [:i.fa.fa-save
                {"(click)" "saveExpense(expense)"
                 :title "click to save changes"}]
              [:i.fa.fa-times
                {"(click)" "delExpense(expense)"
                 :title "click to delete expense"}]]]]]
      [:div.users.col-md-3
        {"*ngIf" "isManager()"}
        [:h5 "Users (click button to see tracking)"]
        [:div.inline
          {"*ngFor" "let user of users;"}
          [:button.btn.left.username
            {"[disabled]" "noViewer(user)"
            "(click)" "selectUser(user)"}
            "{{user.username}}"]
          [:div.left.role
            {"*ngIf" "isManager()"}
            [:select
              {"[ngModel]" "user.role"
                "(ngModelChange)" "roleChange(user, $event)"}
                [:option
                  {"*ngFor" "let role of roles;"
                    "[value]" "role"}
                    "{{role}}"]]]
          [:i.left.del-user.fa.fa-times
            {"(click)" "deleteUser(user)"
             :title "delete user"}]]]]]))