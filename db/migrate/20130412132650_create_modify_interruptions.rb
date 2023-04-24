class CreateModifyInterruptions < ActiveRecord::Migration[5.1]
  def change
  create_table :interruptions do |t|
      t.bigint :intervention_id
      t.string :kind
      t.text :reason
      t.text :comment
      t.string :photo_file_name
      t.string :photo_content_type
      t.bigint :photo_file_size
      t.datetime :photo_updated_at
      t.timestamps
    end
  end
end