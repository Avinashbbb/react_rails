class CreateOpportunists < ActiveRecord::Migration[5.1]
  def change
    create_table :opportunists do |t|
      t.string :name
      t.datetime :activated_at
      t.boolean :has_write_permission

      t.timestamps
    end
  end
end
