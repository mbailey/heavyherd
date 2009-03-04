class CreateTicketSellers < ActiveRecord::Migration
  def self.up
    create_table :ticket_sellers do |t|
      t.string :name
      t.integer :address_id
      t.string :phone
      t.string :web
      t.string :email

      t.timestamps
    end
  end

  def self.down
    drop_table :ticket_sellers
  end
end
