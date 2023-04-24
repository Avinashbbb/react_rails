class CreateAddresses < ActiveRecord::Migration[5.1]
  def change
    create_table :addresses do |t|
      t.string :door_no, limit: 10
      t.string :adr_1, limit: 50
      t.string :adr_2, limit: 50
      t.string :postal_code, limit: 7
      t.string :province, limit: 3
      t.string :country, limit: 20
      # t.datetime :created_at
      # t.datetime :updated_at
      t.string :address_type, limit: 20
      t.string :city, limit: 45
      t.string :assigned_route, limit: 20
      t.string :long
      t.string :lat
      t.string :status, limit: 20
      t.string :apt
      t.string :default
      t.integer :addressable_id
      t.string :addressable_type
      # t.integer :contact_id

      t.timestamps
    end
  end
end