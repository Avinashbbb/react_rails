class CreateContracts < ActiveRecord::Migration[5.1]
  def change
    create_table :contracts do |t|
      t.integer :customer_id
      t.integer :billing_address_id
      t.integer :shipping_address_id
      t.string :name, limit: 100
      t.string :contract_no, limit: 30
      t.integer :parent_id
      t.string :vocation, limit: 50
      t.integer :alternate_address_id
      t.string :integration_status, limit: 20
      t.boolean :cod
      t.integer :account_id
      t.string :seller_name
      t.string :lead_source
      t.string :construction_type
      t.boolean :installation
      t.date :contract_sold_at
      t.integer :sales_responsable_id
      t.string :lost_reason
      t.string :google_event_id
      t.integer :quantity_door
      t.integer :quantity_window
      t.integer :quantity_sliding_door
      t.text :note
      t.datetime :followup_at
      t.string :status, limit: 50
      t.integer :quote_id
      t.datetime :status_changed_at
      t.integer :opportunity_id
      t.string :payment_method
      t.string :lost_precision
      t.string :lost_to
      t.decimal :amount
      t.string :google_measuring_event_id
      t.text :approver_verification_note
      t.text :responsable_verification_note
      t.float :price_adjustment_amount
      t.text :price_note_to_analysis
      t.text :price_note_to_seller
      # t.datetime :work_start_date

      t.timestamps
    end
  end
end