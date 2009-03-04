class CreateOfferings < ActiveRecord::Migration
  def self.up
    create_table :offerings do |t|
      t.integer :ticket_seller_id
      t.integer :gig_id

      t.timestamps
    end
  end

  def self.down
    drop_table :offerings
  end
end
