class CreateCustomers < ActiveRecord::Migration[5.1]
  def change
    create_table :customers do |t|
      t.string :name, limit: 100
      t.string :customer_type, limit: 30
      t.string :caa_no, limit: 20
      t.boolean :cod
      t.float :percent_discount
      t.string :tribe_number, limit: 20
      t.string :source
      t.string :source_other
      t.boolean :matches_other
      t.string :tribe_name
      t.string :category
      t.belongs_to :opportunists, null: false, foreign_key: true
      t.string :migration_source
      # t.string :payment_profile_id
      # t.boolean :inactive
      # t.string :language, limit: 2
      # t.belongs_to :royalty_opportunist, null: false, foreign_key: true
      # t.decimal :royalty_percent

      t.timestamps
    end
  end
end