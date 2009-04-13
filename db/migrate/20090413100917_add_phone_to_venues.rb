class AddPhoneToVenues < ActiveRecord::Migration
  def self.up
    add_column :venues, :phone, :string
  end

  def self.down
    remove_column :venues, :phone
  end
end
