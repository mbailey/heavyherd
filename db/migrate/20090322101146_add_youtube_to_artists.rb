class AddYoutubeToArtists < ActiveRecord::Migration
  def self.up
    add_column :artists, :youtube, :string
  end

  def self.down
    remove_column :artists, :youtube
  end
end
