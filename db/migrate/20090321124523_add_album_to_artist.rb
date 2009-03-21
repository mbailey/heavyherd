class AddAlbumToArtist < ActiveRecord::Migration
  def self.up
    add_column :artists, :album, :string
  end

  def self.down
    remove_column :artists, :album
  end
end
