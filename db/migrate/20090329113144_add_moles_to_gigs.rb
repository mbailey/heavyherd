class AddMolesToGigs < ActiveRecord::Migration
  def self.up
    add_column :gigs, :moles, :integer, :default => 0
  end

  def self.down
    remove_column :gigs, :moles
  end
end
