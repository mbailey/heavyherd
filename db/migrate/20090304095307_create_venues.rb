class CreateVenues < ActiveRecord::Migration
  def self.up
    create_table :venues do |t|
      t.string :name
      t.integer :address_id
      t.string :email
      t.string :web

      t.timestamps
    end
  end

  def self.down
    drop_table :venues
  end
end
