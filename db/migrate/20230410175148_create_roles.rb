class CreateRoles < ActiveRecord::Migration[5.1]
  def change
    create_table :roles do |t|
      t.string :name
      # t.string :resource_type
      t.references :resource, polymorphic: true
      t.timestamps null: false
    end

    add_index :roles, [:name, :resource_type, :resource_id], unique: true, name: 'index_roles_on_name_and_resource_type_and_resource_id'
    add_index :roles, :name
    # add_index :roles, [:resource_type, :resource_id], name: 'index_roles_on_resource_type_and_resource_id'
  end
end