class AddTrackListingToArtist < ActiveRecord::Migration
  def self.up
    add_column :artists, :discog_title, :string
    add_column :artists, :discog_detail, :string
  end

  def self.down
    remove_column :artists, :discog_title
    remove_column :artists, :discog_detail
  end
end
