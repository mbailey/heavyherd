class AddTicketsToGigs < ActiveRecord::Migration
  def self.up
    add_column :gigs, :tickets, :string
  end

  def self.down
    remove_column :gigs, :tickets
  end
end
