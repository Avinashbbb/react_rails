# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20230410180631) do

  create_table "account_statement_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "account_statement_id"
    t.string "item_type"
    t.integer "franchise_id"
    t.decimal "amount", precision: 8, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_statement_id"], name: "index_account_statement_items_on_account_statement_id"
  end

  create_table "account_statements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "franchise_id"
    t.string "account_statement_type"
    t.decimal "total_invoice", precision: 8, scale: 2
    t.decimal "network_fee", precision: 8, scale: 2
    t.decimal "advertising_fee", precision: 8, scale: 2
    t.decimal "royalty_fee", precision: 8, scale: 2
    t.decimal "management_fee", precision: 8, scale: 2
    t.decimal "insurance_fee", precision: 15, scale: 12
    t.decimal "payment_management_fee", precision: 8, scale: 2
    t.decimal "supply_reserve_fee", precision: 8, scale: 2
    t.decimal "it_support_fee", precision: 15, scale: 12
    t.decimal "adjustment", precision: 8, scale: 2
    t.decimal "deposit_amount", precision: 8, scale: 2
    t.string "deposit_status"
    t.text "sub_franchises_due"
    t.text "sub_franchises_tickets"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "scope_start_at"
    t.datetime "scope_end_at"
    t.decimal "franchise_royaltee_fees", precision: 8, scale: 2
    t.decimal "supply_reserve_used", precision: 8, scale: 2
    t.decimal "product_sale", precision: 8, scale: 2
    t.integer "parent_id"
    t.decimal "ticket_amount", precision: 15, scale: 12
    t.decimal "total_invoice_without_tax", precision: 8, scale: 2
  end

  create_table "accounting_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.text "description"
    t.integer "accounting_template_uid"
    t.integer "accounting_subitems_uid"
    t.string "accounting_estimate_no"
    t.integer "accounting_items_line_num"
    t.integer "parent_id"
    t.decimal "quantity", precision: 8, scale: 2
    t.decimal "unit_price", precision: 8, scale: 2
    t.decimal "amount", precision: 8, scale: 2
    t.integer "contract_id"
    t.string "sku"
    t.boolean "has_limit", default: false
    t.integer "limit"
    t.text "bundle_note"
  end

  create_table "addresses", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "door_no", limit: 10
    t.string "adr_1", limit: 50
    t.string "adr_2", limit: 50
    t.string "postal_code", limit: 7
    t.string "province", limit: 3
    t.string "country", limit: 20
    t.string "address_type", limit: 20
    t.string "city", limit: 45
    t.string "assigned_route", limit: 20
    t.string "long"
    t.string "lat"
    t.string "status", limit: 20
    t.string "apt"
    t.string "default"
    t.integer "addressable_id"
    t.string "addressable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "contact_id"
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable_type_and_addressable_id"
  end

  create_table "areas", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "address_id"
    t.integer "customer_id"
    t.string "code"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "assignments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "job_id"
    t.bigint "unit_id"
    t.date "date"
    t.integer "display_order"
    t.boolean "published", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "fk_rails_4f003e6587"
    t.index ["unit_id"], name: "fk_rails_40eee10fb8"
  end

  create_table "blazer_audits", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.timestamp "created_at"
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "creator_id"
    t.bigint "query_id"
    t.string "state"
    t.string "schedule"
    t.text "emails"
    t.text "slack_channels"
    t.string "check_type"
    t.text "message"
    t.timestamp "last_run_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "creator_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "container_kinds", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contracts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "customer_id"
    t.integer "billing_address_id"
    t.integer "shipping_address_id"
    t.string "name", limit: 100
    t.string "contract_no", limit: 30
    t.integer "parent_id"
    t.string "vocation", limit: 50
    t.integer "alternate_address_id"
    t.string "integration_status", limit: 20
    t.boolean "cod"
    t.integer "account_id"
    t.string "seller_name"
    t.string "lead_source"
    t.string "construction_type"
    t.boolean "installation"
    t.date "contract_sold_at"
    t.integer "sales_responsable_id"
    t.string "lost_reason"
    t.string "google_event_id"
    t.integer "quantity_door"
    t.integer "quantity_window"
    t.integer "quantity_sliding_door"
    t.text "note"
    t.datetime "followup_at"
    t.string "status", limit: 50
    t.integer "quote_id"
    t.datetime "status_changed_at"
    t.integer "opportunity_id"
    t.string "payment_method"
    t.string "lost_precision"
    t.string "lost_to"
    t.decimal "amount", precision: 10
    t.string "google_measuring_event_id"
    t.text "approver_verification_note"
    t.text "responsable_verification_note"
    t.float "price_adjustment_amount", limit: 24
    t.text "price_note_to_analysis"
    t.text "price_note_to_seller"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "start_date"
    t.datetime "expire_date"
    t.integer "duration"
    t.integer "accounting_estimate_id"
    t.string "facturation_type"
    t.datetime "work_start_date"
  end

  create_table "customer_items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "location_id"
    t.integer "customer_id"
    t.integer "item_id"
    t.string "average_duration"
    t.string "name"
    t.string "note_schedule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.integer "container_kind_id"
    t.text "note_access"
    t.text "note_before_start"
    t.text "note_comments"
    t.text "note_location"
    t.boolean "prepared"
    t.date "expiration_date"
    t.integer "accounting_item_id"
    t.integer "contract_id"
    t.text "bundle_note"
  end

  create_table "customer_notifications", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "customer_id"
    t.string "email"
    t.boolean "email_on_comment"
    t.boolean "email_on_interruption"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_customer_notifications_on_customer_id"
  end

  create_table "customers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name", limit: 100
    t.string "customer_type", limit: 30
    t.string "caa_no", limit: 20
    t.boolean "cod"
    t.float "percent_discount", limit: 24
    t.string "tribe_number", limit: 20
    t.string "source"
    t.string "source_other"
    t.boolean "matches_other"
    t.string "tribe_name"
    t.string "category"
    t.bigint "opportunists_id", null: false
    t.string "migration_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "accounting_uid"
    t.string "payment_profile_id"
    t.boolean "inactive", default: false
    t.string "language", default: "FR"
    t.integer "royalty_opportunist_id"
    t.decimal "royalty_percent", precision: 10, scale: 2
    t.index ["opportunists_id"], name: "index_customers_on_opportunists_id"
  end

  create_table "differed_transactions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "additional_infos"
    t.string "payable_type"
    t.bigint "payable_id"
    t.boolean "processed"
    t.datetime "processed_at"
    t.string "status"
    t.string "results"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "amount", precision: 10, scale: 2
    t.string "transaction_type"
    t.index ["payable_type", "payable_id"], name: "index_differed_transactions_on_payable_type_and_payable_id"
  end

  create_table "geolocations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "geolocatable_type"
    t.bigint "geolocatable_id"
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.decimal "altitude", precision: 10, scale: 6
    t.decimal "timestamp", precision: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["geolocatable_type", "geolocatable_id"], name: "index_geolocations_on_geolocatable_type_and_geolocatable_id"
  end

  create_table "integrations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "user_id"
    t.string "name"
    t.text "access_token"
    t.text "realm_id"
    t.text "refresh_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "interruptions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "intervention_id"
    t.string "kind"
    t.text "reason"
    t.text "comment"
    t.string "photo_file_name"
    t.string "photo_content_type"
    t.bigint "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["intervention_id"], name: "fk_rails_36b11931f9"
  end

  create_table "intervention_templates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "job_template_id"
    t.string "kind"
    t.string "display_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location_kind"
    t.string "hook"
  end

  create_table "interventions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "job_id"
    t.integer "intervention_template_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "location_id"
    t.string "kind"
    t.integer "display_order"
    t.string "location_kind"
    t.string "hook"
    t.float "weight", limit: 24
    t.index ["job_id"], name: "fk_rails_10e68912d2"
    t.index ["location_id"], name: "fk_rails_e054b90844"
    t.index ["start_time"], name: "index_interventions_on_start_time"
  end

  create_table "item_kinds", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "item_specs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "item_kind_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "items", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "item_kind_id"
    t.integer "item_spec_id"
    t.string "identifier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "job_templates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "code"
    t.string "kind"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "jobs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.integer "customer_item_id"
    t.integer "job_template_id"
    t.string "average_duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.date "end_date"
    t.text "note_access"
    t.text "note_before_start"
    t.text "note_comments"
    t.text "note_location"
    t.text "note_schedule"
    t.integer "customer_location_id"
    t.integer "supplier_location_id"
    t.string "code"
    t.string "kind"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.datetime "duration"
    t.integer "item_id"
    t.integer "parent_id"
    t.datetime "original_start_date"
    t.datetime "calendar_start_at"
    t.datetime "calendar_end_at"
    t.boolean "calendar_all_day"
    t.string "accounting_uid"
    t.string "payment_uid"
    t.datetime "payment_at"
    t.datetime "bill_sent_at"
    t.index ["start_date"], name: "index_jobs_on_start_date"
  end

  create_table "locations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "locatable_id"
    t.string "locatable_type"
    t.index ["locatable_type", "locatable_id"], name: "index_locations_on_locatable_type_and_locatable_id"
  end

  create_table "oauth_access_grants", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes"
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id"
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "opportunists", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "activated_at"
    t.boolean "has_write_permission"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payment_bank_accounts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "parent_type"
    t.bigint "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.binary "account_number"
    t.string "institution_number"
    t.string "transit_number"
    t.index ["parent_type", "parent_id"], name: "index_payment_bank_accounts_on_parent_type_and_parent_id"
  end

  create_table "payment_cards", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "parent_type"
    t.bigint "parent_id"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cvv"
    t.index ["parent_type", "parent_id"], name: "index_payment_cards_on_parent_type_and_parent_id"
  end

  create_table "payment_configs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "integration_name"
    t.string "config"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payment_methods", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.string "payment_type"
    t.integer "qb_id"
    t.string "qb_sync_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payment_user_tokens", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "parent_type"
    t.bigint "parent_id"
    t.string "token"
    t.datetime "token_expire_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_type", "parent_id"], name: "index_payment_user_tokens_on_parent_type_and_parent_id"
  end

  create_table "recurrences", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "recurrable_type"
    t.integer "recurrable_id"
    t.string "action"
    t.date "start_date"
    t.date "end_date"
    t.text "schedule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recurrable_type", "recurrable_id"], name: "index_recurrences_on_recurrable_type_and_recurrable_id"
  end

  create_table "roles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", unique: true
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "suppliers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "units", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.integer "franchise_id"
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.string "provider"
    t.string "uid"
    t.string "email"
    t.string "encrypted_password"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count"
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.text "tokens"
    t.string "access_token"
    t.string "refresh_token"
    t.string "password"
    t.string "password_confirmation"
    t.boolean "wants_to_follow_new_quotes"
    t.string "x_token_user"
    t.boolean "does_not_wants_to_follow_new_quotes"
    t.string "oauth_token"
    t.datetime "oauth_expires_at"
    t.integer "opportunist_id"
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users_roles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb3" do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "assignments", "jobs"
  add_foreign_key "assignments", "units"
  add_foreign_key "customers", "opportunists", column: "opportunists_id"
  add_foreign_key "interruptions", "interventions"
  add_foreign_key "interventions", "jobs"
  add_foreign_key "interventions", "locations"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "users_roles", "roles"
  add_foreign_key "users_roles", "users"
end
