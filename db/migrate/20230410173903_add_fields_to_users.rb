class AddFieldsToUsers < ActiveRecord::Migration[5.1]
  def up
    # add_column :users, :first_name, :string
    # add_column :users, :last_name, :string

    # remove_columns :users, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email, :name
  end

  def down
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmed_at, :datetime
    add_column :users, :confirmation_sent_at, :datetime
    add_column :users, :unconfirmed_email, :string
    add_column :users, :name, :string

    remove_columns :users, :first_name, :last_name
  end
end
