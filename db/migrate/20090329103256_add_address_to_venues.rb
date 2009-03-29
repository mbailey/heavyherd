class AddAddressToVenues < ActiveRecord::Migration
  def self.up
    add_column :venues, :address_1, :string
    add_column :venues, :address_2, :string
    add_column :venues, :city, :string
    add_column :venues, :state, :string
    add_column :venues, :postcode, :string
    add_column :venues, :lat, :float
    add_column :venues, :lng, :float
  end

  def self.down
    add_column :venues, :address_1
    add_column :venues, :address_2
    add_column :venues, :city
    add_column :venues, :state
    add_column :venues, :postcode
    add_column :venues, :lat
    add_column :venues, :lng
  end
end
