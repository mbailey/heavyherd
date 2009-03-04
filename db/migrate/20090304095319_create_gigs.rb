class CreateGigs < ActiveRecord::Migration
  def self.up
    create_table :gigs do |t|
      t.integer :venue_id
      t.integer :artist_id
      t.date :date
      t.float :price
      t.time :door_open
      t.boolean :sold_out

      t.timestamps
    end
  end

  def self.down
    drop_table :gigs
  end
end
