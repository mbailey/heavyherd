class CreateAddresses < ActiveRecord::Migration
  def self.up
    create_table :addresses do |t|
      t.string :address_1
      t.string :address_2
      t.string :city
      t.string :state
      t.string :postcode
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end

  def self.down
    drop_table :addresses
  end
end
