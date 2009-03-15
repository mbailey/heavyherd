class AddOverImageToArtists < ActiveRecord::Migration
  def self.up
    add_column :artists, :cover_image, :string
  end

  def self.down
    remove_column :artists, :cover_image
  end
end
