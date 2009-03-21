class AddDescriptionToArtist < ActiveRecord::Migration
  def self.up
    add_column :artists, :description, :string
  end

  def self.down
    remove_column :artists, :description
  end
end
